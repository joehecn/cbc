const { contextBridge, ipcRenderer } = require('electron');
const { __RENDERER_PROMISE_MSG__ } = require('./__RENDERER_PROMISE_MSG__.json');
const { __RENDERER_MSG__ } = require('./__RENDERER_MSG__.json');
const { __J_MAIN__ } = require('./__J_MAIN__.json');

const ipc = {
  sendPromise(msg) {
    return new Promise((resolve) => {
      const { key } = msg;
      const time = Date.now();
      const eventName = `${key}-${time}`;

      msg.eventName = eventName;

      ipcRenderer.once(eventName, (_, msg) => {
        resolve(msg);
      });

      ipcRenderer.send(__RENDERER_PROMISE_MSG__, msg);
    });
  },

  send(msg) {
    ipcRenderer.send(__RENDERER_MSG__, msg);
  }
};

contextBridge.exposeInMainWorld(__J_MAIN__, {
  ipc
});
