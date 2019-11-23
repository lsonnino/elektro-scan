const { app, BrowserWindow } = require('electron')
const Store = require('./gui/js/store.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const store = new Store({
    // User preferences stored in file called 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        behaviour: { quitOnClose: false }
    }
});

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true
        },
        titleBarStyle: 'hidden',
        backgroundColor: '#323232',  // rgb(50, 50, 50). Must be the same as --window-color in css/styles.css
        icon: __dirname + '/icon/Icon.icns'
    })

    // and load the index.html of the app.
    win.loadFile('gui/index.html')

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin' || store.get('behaviour').quitOnClose) {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
