<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useStore } from '../store';
import { Msg } from '../../util/config';

export default defineComponent({
  setup() {
    const store = useStore();
    const github = store.state.github;
    const ipc: any = inject('ipc');

    const gotoDownloadPage = () => {
      const msg: Msg<string> = {
        key: 'github',
        value: github.html_url
      };
      ipc.send(msg);
    };

    return {
      github,
      gotoDownloadPage
    };
  }
});
</script>

<template>
  <div id="github">
    <p>The old version is out of use!</p>
    <h1>new version: {{ github && github.tag_name }}</h1>
    <el-link type="primary" @click="gotoDownloadPage">Download page >></el-link>
  </div>
</template>