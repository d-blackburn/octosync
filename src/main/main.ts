/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, safeStorage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';
import keytar from 'keytar';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { DeviceAuthResponse } from '../github/deviceAuthResponse';
import { retrieveAccessToken } from '../github/retrieveAccessToken';

const clientId = 'Ov23liRR3q1G6ZaAQ8ap';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('favicon.ico'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    ipcMain.on('login-with-github', async () => {
      console.log('Attempting login...');

      // Step 1: Get device and user codes
      const { data } = await axios.post(
        'https://github.com/login/device/code',
        {
          client_id: clientId,
          scope: 'repo',
        },
      );

      const searchParams = new URLSearchParams(data);
      const deviceAuthInfo: DeviceAuthResponse = {
        user_code: searchParams.get('user_code') ?? '',
        device_code: searchParams.get('device_code') ?? '',
        expires_in: parseInt(searchParams.get('expires_in') ?? '0', 10),
        interval: parseInt(searchParams.get('interval') ?? '0', 10),
        verification_uri: searchParams.get('verification_uri') ?? '',
      };

      // Send user_code and verification_uri to React frontend
      mainWindow?.webContents.send('github-device-auth', deviceAuthInfo);

      await retrieveAccessToken(clientId, deviceAuthInfo);
      mainWindow?.webContents.send('github-token-retrieved');
    });
    ipcMain.on('decrypt-github-access-token', async (event) => {
      const encryptedToken = await keytar.getPassword(
        'octosync',
        'github-token',
      );
      if (encryptedToken !== null) {
        try {
          event.returnValue = safeStorage.decryptString(
            Buffer.from(encryptedToken, 'base64'),
          );
        } catch {
          ipcMain.emit('logout');
        }
      }

      event.returnValue = null;
    });

    ipcMain.on('logout', (event, callback: () => void) => {
      console.log('Logging out!');
      keytar
        .deletePassword('octosync', 'github-token')
        .then(callback)
        .catch(() => console.error('Unable to delete token from storage'));

      mainWindow?.webContents.send('github-token-deleted');
    });
  })
  .catch(console.log);
