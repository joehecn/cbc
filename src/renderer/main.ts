import { createApp } from 'vue';
// element
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import router from './router';
import store from './store';

import ipc from './ipc';

import App from './App.vue';

import github from './github';
import { version } from '../../package.json';

document.title = `CBC v${version}`;

const app = createApp(App);

app.use(ElementPlus);

app.use(router);
app.use(store);

app.provide('ipc', ipc);

app.mount('#app');

/**
 * 检查版本
 */
github()
  .then((res) => {
    store.commit('setGithub', { github: res });

    if (res.tag_name !== version) {
      router.replace('github');
    }
  })
  .catch((err) => {
    console.log('---- github() catch err');
    console.error(err);
  });
