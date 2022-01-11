import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import { __MAIN_MSG__, __RENDERER_MSG__, LIFE_ENUM, STATE_ENUM, Task, Msg } from '../util/config';
import { taskStep1, destorySourceClient, taskStep2 } from './mqtt';
import mainEmitter from './mainEmitter';

const IS_DEV = process.env.NODE_ENV === 'development';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, '..', 'util', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (IS_DEV) {
    const rendererPort = process.argv[2];
    // const uri = path.join(__dirname, '..', '..', 'dist', 'renderer/');
    // console.log(uri);
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainEmitter.on('mqtt-handle-msg', (m: Msg<Task>) => {
    const { key: platform, value } = m;
    if (platform === 'source') {
      if (value.sourceState === STATE_ENUM.ONLINE && value.sourceOnlineMsgCount === 1) {
        taskStep2(value);
      }
    } else if (platform === 'target') {
      if (value.targetState === STATE_ENUM.UPDATE_COMPLETE) {
        destorySourceClient(value);
      }
    }

    const msg: Msg<Task> = {
      key: 'mqtt-handle-msg',
      value
    };
    mainWindow.webContents.send(__MAIN_MSG__, msg);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on(__RENDERER_MSG__, async (_, msg) => {
  const { key, value } = msg;

  switch (key) {
    case 'github':
      shell.openExternal(value);
      break;
    case 'send-ota-cmd-step1':
      taskStep1(value);
      break;
    case 'cancel-ota-cmd':
      // console.log('case cancel-ota-cmd');
      value.life = LIFE_ENUM.END;
      value.sourceState = STATE_ENUM.CANCEL;
      destorySourceClient(value, true);
      break;
    default:
      break;
  }
});
