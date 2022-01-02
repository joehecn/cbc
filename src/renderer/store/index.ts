import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      github: null
    };
  },
  mutations: {
    setGithub(state: any, { github }) {
      state.github = github;
    }
  }
});

export default store;
