const { contextBridge, ipcRenderer } = require('electron');
const { __J_MAIN__ } = require('./__J_MAIN__.json');
const { __MAIN_MSG__ } = require('./__MAIN_MSG__.json');
const { __RENDERER_MSG__ } = require('./__RENDERER_MSG__.json');

const ipc = {
  send(msg) {
    ipcRenderer.send(__RENDERER_MSG__, msg);
  },

  on(callback) {
    ipcRenderer.on(__MAIN_MSG__, (_, msg) => callback(msg));
  }
};

contextBridge.exposeInMainWorld(__J_MAIN__, {
  ipc
});
