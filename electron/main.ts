import { app, BrowserWindow, ipcMain, session } from 'electron'
import Store from 'electron-store'
import path from 'path'

const store = new Store<{
  gatewayUrl: string
  gatewayToken: string
  configured: boolean
}>({
  defaults: {
    gatewayUrl: '',
    gatewayToken: '',
    configured: false
  }
})

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  const configured = store.get('configured')
  const gatewayUrl = store.get('gatewayUrl') || ''
  const gatewayToken = store.get('gatewayToken') || ''

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Samaritan',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.setMenuBarVisibility(false)

  if (!configured || !gatewayUrl) {
    // Load setup screen
    mainWindow.loadFile(path.join(__dirname, 'setup.html'))
  } else {
    // Inject auth token into every request to the gateway
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: [`${gatewayUrl}/*`] },
      (details, callback) => {
        callback({
          requestHeaders: {
            ...details.requestHeaders,
            'authorization': `Bearer ${gatewayToken}`,
            'x-openclaw-token': gatewayToken
          }
        })
      }
    )
    mainWindow.loadURL(gatewayUrl)
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

ipcMain.handle('store:get', (_event, key: string) => store.get(key))
ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
  store.set(key, value)
})
ipcMain.handle('store:getAll', () => store.store)

// Called from setup page when user saves config
ipcMain.handle('setup:connect', async (_event, gatewayUrl: string, gatewayToken: string) => {
  // Test connection first
  try {
    const res = await fetch(`${gatewayUrl}/health`, {
      headers: { 'authorization': `Bearer ${gatewayToken}`, 'x-openclaw-token': gatewayToken }
    })
    if (!res.ok) throw new Error(`Gateway returned ${res.status}`)
  } catch (err) {
    return { ok: false, error: String(err) }
  }

  store.set('gatewayUrl', gatewayUrl)
  store.set('gatewayToken', gatewayToken)
  store.set('configured', true)

  // Reload window pointing at gateway
  if (mainWindow) {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: [`${gatewayUrl}/*`] },
      (details, callback) => {
        callback({
          requestHeaders: {
            ...details.requestHeaders,
            'authorization': `Bearer ${gatewayToken}`,
            'x-openclaw-token': gatewayToken
          }
        })
      }
    )
    mainWindow.loadURL(gatewayUrl)
  }

  return { ok: true }
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
