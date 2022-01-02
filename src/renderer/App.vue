<script setup lang="ts">
// // This starter template is using Vue 3 <script setup> SFCs
// // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue';
// import { ipcRenderer } from '@/electron';
// // console.log({ ipcRenderer });
// ipcRenderer.send('message', 'Hello from App.vue!');
</script>

<template>
  <!-- <el-button>Default</el-button>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <el-main class="me-main">
    <router-view></router-view>
  </el-main>
</template>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
