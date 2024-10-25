// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  safeStorage,
} from 'electron';

import keytar from 'keytar';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    loginWithGitHub: () => ipcRenderer.send('login-with-github'),
    addGitHubDeviceAuthListener: (callback: any) =>
      ipcRenderer.on('github-device-auth', callback),
    removeGitHubDeviceAuthListener: (callback: any) =>
      ipcRenderer.removeListener('github-device-auth', callback),
    addGitHubTokenRetrievedListener: (callback: any) =>
      ipcRenderer.on('github-token-retrieved', callback),
    removeGitHubTokenRetrievedListener: (callback: any) =>
      ipcRenderer.removeListener('github-token-retrieved', callback),
    decryptGitHubToken: async () => {
      const token: string | null = ipcRenderer.sendSync(
        'decrypt-github-access-token',
      );

      return token;
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
