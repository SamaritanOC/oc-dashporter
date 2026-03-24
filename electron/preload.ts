import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('samaritan', {
  connect: (gatewayUrl: string, gatewayToken: string) =>
    ipcRenderer.invoke('setup:connect', gatewayUrl, gatewayToken),
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
    getAll: () => ipcRenderer.invoke('store:getAll')
  }
})
