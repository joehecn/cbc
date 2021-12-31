# cbc

## 1.0.0 install vite with template vue-ts

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

## github

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

-----------------------------------------------------------------------

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
