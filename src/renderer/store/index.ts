import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { Task, OtaListRow, LIFE_ENUM } from '../../util/config';

// 为 store state 声明类型
export interface State {
  github: any;
  taskList: Task[];
  otaList: OtaListRow[];
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    github: null,
    taskList: [],
    otaList: [
      // {
      //   id: 'T01',
      //   version: 'aaa',
      //   state: STATE_ENUM.ONLINE,
      //   life: LIFE_ENUM.END
      // }
    ]
  },
  mutations: {
    setGithub(state, { github }) {
      state.github = github;
    },

    addTask(state, { task }) {
      state.taskList.push(task);
    },

    updateTask(state, { task }) {
      for (let i = 0, len = state.taskList.length; i < len; i++) {
        const item = state.taskList[i];
        if (item.taskID === task.taskID) {
          state.taskList[i] = task;
          return;
        }
      }

      state.taskList.push(task);
    },

    updateOta(state, { ota }) {
      for (let i = 0, len = state.otaList.length; i < len; i++) {
        const item = state.otaList[i];
        if (item.id === ota.id) {
          const _ota = Object.assign(item, ota);
          state.otaList[i] = _ota;
          return;
        }
      }

      if (!Object.hasOwnProperty.call(ota, 'life')) {
        ota.life = LIFE_ENUM.END;
      }
      state.otaList.push(ota);
    }
  }
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
