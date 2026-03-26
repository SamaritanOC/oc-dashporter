import { app, BrowserWindow, shell } from 'electron'

const GATEWAY_ORIGIN = 'http://127.0.0.1:18789'

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'OC Dashporter',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    }
  })

  // Block navigation outside the local gateway origin —
  // external links open in the system browser instead.
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const target = new URL(url)
    const allowed = new URL(GATEWAY_ORIGIN)
    if (target.origin !== allowed.origin) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  // Deny all new-window requests from inside the Control UI;
  // route them to the system browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(GATEWAY_ORIGIN)
  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())
// Note: 'activate' is macOS-only — removed, this app is Linux-only.
