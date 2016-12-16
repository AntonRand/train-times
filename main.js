const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')
var Positioner = require('electron-positioner')

const assetsDirectory = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

let toggleState = false;

// Don't show the app in the doc
//app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'train.png'))
  tray.setTitle('Rail Client');
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', toggleWindow)
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  //const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  const x = trayBounds.trayBounds;

  // Position window 4 pixels vertically below the tray icon
  //const y = Math.round(trayBounds.y + trayBounds.height + 4)
  const y = trayBounds.y;


  return {x: x, y: y}
}

const createWindow = () => {

  console.log('createWindow()');

  window = new BrowserWindow({
    title: 'Rail Client',
    width: 780,
    height: 570,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
      devTools: true
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  //window.webContents.openDevTools()
  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      //window.hide()
      //toggleWindow();
    }
  })
}

const toggleWindow = () => {
  console.log('Window Visible: ' + window.isVisible());
  if (toggleState) {
    window.hide()
  } else {
    showWindow()
  }
  toggleState = !toggleState;
}

const showWindow = () => {
  console.log('showWindow()');
  var positioner = new Positioner(window);
  positioner.move('center');
  window.show();
  window.focus();
}

ipcMain.on('show-window', () => {
  showWindow();
})