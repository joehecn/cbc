import { createApp } from 'vue';
// element
import ElementPlus, { ElNotification } from 'element-plus';
import 'element-plus/dist/index.css';

import './element-variables.scss';

import router from './router';
import { store, key } from './store';

import ipc from './ipc';

import App from './App.vue';

import github from './github';
import { version } from '../../package.json';

import { ArrowLeft, ArrowRight, Loading, Switch } from '@element-plus/icons-vue';
import { STATE_ENUM, TP } from '../util/config';

const otaClientHandleMsg = (value: TP) => {
  const { topic, payloadStr } = value;
  // console.log({ topic, payloadStr });
  const topicArr = topic.split('/');
  const payload = JSON.parse(payloadStr);

  if (topicArr[1] === 'info') {
    const state = payload.state === 'ONLINE' ? STATE_ENUM.ONLINE : STATE_ENUM.OFFLINE;
    store.commit('updateOta', {
      ota: {
        id: topicArr[0],
        version: payload.firmware,
        state
      }
    });
  } else {
    console.log('------- otaClientHandleMsg');
    console.log({ topic, payloadStr });
  }
};

ipc.on((msg: any) => {
  const { key, value } = msg;
  // console.log({ key, value });

  switch (key) {
    case 'mqtt-handle-msg':
      // console.log({ value });
      store.commit('updateTask', { task: value });
      break;
    case 'ota-client-handle-msg':
      // console.log({ value });
      otaClientHandleMsg(value);
      break;

    default:
      break;
  }
});

document.title = `CBC v${version}`;

const app = createApp(App);

app.provide('ipc', ipc);

app.provide('notif', ElNotification);
app.component('arrow-left', ArrowLeft);
app.component('arrow-right', ArrowRight);
app.component('icon-loading', Loading);
app.component('icon-switch', Switch);

app.use(ElementPlus);
app.use(router);

// 传入 injection key
app.use(store, key);

app.mount('#app');

/**
 * 检查版本
 */
github()
  .then((json) => {
    if (!json) throw new Error('get github error!');

    store.commit('setGithub', { github: json });

    if (json.tag_name !== `v${version}`) {
      router.replace('github');
    }
  })
  .catch((err) => {
    console.log('---- github() catch err');
    console.error(err);
  });
