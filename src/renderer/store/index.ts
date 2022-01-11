import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { Task } from '../../util/config';

// 为 store state 声明类型
export interface State {
  github: any;
  taskList: Task[];
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    github: null,
    taskList: []
  },
  mutations: {
    setGithub(state, { github }) {
      state.github = github;
    },

    addTaskList(state, { task }) {
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
    }
  }
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
