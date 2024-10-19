// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

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
      ipcRenderer.addListener('github-device-auth', callback),
    removeGitHubDeviceAuthListener: (callback: any) =>
      ipcRenderer.removeListener('github-device-auth', callback),
    addGitHubTokenRetrievedListener: (callback: any) =>
      ipcRenderer.addListener('github-token-retrieved', callback),
    removeGitHubTokenRetrievedListener: (callback: any) =>
      ipcRenderer.removeListener('github-token-retrieved', callback),
    addGitHubTokenDeletedListener: (callback: any) =>
      ipcRenderer.addListener('github-token-deleted', callback),
    removeGitHubTokenDeletedListener: (callback: any) =>
      ipcRenderer.removeListener('github-token-deleted', callback),
    decryptGitHubToken: async () => {
      const token: string | null = await ipcRenderer.sendSync(
        'decrypt-github-access-token',
      );
      return token;
    },
    logout: () => ipcRenderer.send('logout'),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
