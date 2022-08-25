'use strict'

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain
} from 'electron'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production';

const pty = require("node-pty");
const os = require("os");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let win;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    } else {
        createProtocol('app')
        win.loadURL('app://./index.html#/')
    }
}

// 创建终端
ipcMain.handle("terminal-create", (event) => {
    let term = pty.spawn(shell, [], {
        name: "xterm-color",
        cwd: process.env.PWD,
        env: process.env
    });
    const pid = term.pid;
    const channels = ["terminal-incomingData-" + pid, "terminal-keystroke-" + pid, "terminal-resize-" + pid, "terminal-close-" + pid];
    // 命令反馈
    term.onData(function(data) {
            win.webContents.send(channels[0], data);
        })
        // 命令输入
    ipcMain.on(channels[1], (event, key) => {
        term.write(key);
    });
    // 尺寸调整
    ipcMain.on(channels[2], (event, cols, rows) => {
        term.resize(cols, rows);
    });
    // 终端关闭
    ipcMain.on(channels[3], (event) => {
        term.kill();
        ipcMain.removeAllListeners([channels[1], channels[2], channels[3]]);
    });
    return pid;
});


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}