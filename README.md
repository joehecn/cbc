# cbc

## V0.0.0

从一个 vite-ts 模版项目开始

### 0-1. install vite with template vue-ts

参考: https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project

```bash
npm init vite@latest cbc -- --template vue-ts
cd cbc
code .
# 删除 package 的依赖 dependencies devDependencies
# 全部安装最新的包到 devDependencies
npm i -D vue@next @vitejs/plugin-vue typescript vite vue-tsc

npm run dev
npm run build
npm run preview
```

## V0.1.0

github 版本管理

### 1-1. 上传 github

```bash
# 在 github 上创建一个新项目 cbc
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/joehecn/cbc.git
git push -u origin main

npm version minor
git push --follow-tags
```

## V0.2.0

renderer - 渲染进程

### 2-1. 调整 `src` 结构

```bash
# 新建 `src/main/index.ts` - 主进程入口文件
# 新建 `src/renderer` 目录 - 渲染进程
# 把 `vue` 相关的文件全部移动到 `renderer` 目录
# `src/renderer` 目录结构:
- renderer
|- assets
|- components
|- App.vue
|- env.d.ts
|- index.html
|- main.ts

# 修改 index.html 文件:
# 将 `<script type="module" src="/src/main.ts"></script>`
# 改为 `<script type="module" src="/main.ts"></script>`
# 注意: `/main.ts` 要保留前面的斜杠

# fix `npm run dev` 找不到页面的问题
npm i -D @types/node
```

### 2-2. 修改 `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+ import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  + root: path.join(__dirname, 'src', 'renderer'),
  plugins: [vue()]
})
```

### 2-3. 调整 build 后 `dist` 目录结构

```bash
目标结构:
- dist
|- main
  |- index.js
|- renderer
  |- assets
  |- favicon.ico
  |- index.html
```

### 2-4. 修改 `vite.config.ts`

```ts
...
export default defineConfig({
  root: path.join(__dirname, 'src', 'renderer'),
  + publicDir: path.join(__dirname, 'public'),
  + build: {
    + outDir: path.join(__dirname, 'dist', 'renderer')
  + },
  plugins: [vue()]
})
```

### 2-5. Prettier 漂亮格式

```bash
# 安装 `vscode` `Prettier - Code formatter` 插件
# npm
npm i -D prettier
# .vscode/settings.json
# .prettierrc.json
```

### 2-6. Eslint 语法检查

```bash
npm i -D eslint eslint-plugin-import @typescript-eslint/eslint-plugin @typescript-eslint/parser
# .eslintrc.json
# `package.json/script`
# "lint": "eslint --ext .ts ."

npm run lint
```

## V0.3.0

- main - 主进程

### 3-1. tsconfig

```bash
# tsconfig.json
# tsconfig.main.json
# tsconfig.renderer.json
```

### 3-2. npm start

```bash
# `package.json`
# "start": "ts-node scripts/dev-server.ts"

npm i -D ts-node chalk@4.1.2 chokidar

npm i -D electron
node node_modules/electron/install.js

npm i electron-squirrel-startup

```

## V0.5.0

- publish

```bash
# github/workflows/release.yml
# .gitignore
# package.json
# vite.config.ts
npm i -D @electron-forge/cli @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/maker-squirrel @electron-forge/maker-zip @electron-forge/publisher-github
```

## V0.6.0

- preload and element

```bash
npm i -D element-plus
```

## V0.9.0

- 自动更新
- vue-router and vuex

```bash
npm i -D vue-router@4
npm i -D vuex@next
```

---

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
