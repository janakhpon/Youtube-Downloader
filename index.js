
const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1900,
    height: 1000,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html');
  
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

