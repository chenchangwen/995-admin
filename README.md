# 995-admin
> 后台管理应用脚手架

## Architecture

主要基于 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) .

## 调整方法

尽可能不入侵基础框架`vue-element-admin`.      
业务全部写在`./custom`文件夹.对应相关的文件路径.    

**以下直接调整**

#### 文件
* `./src/main.js`: 调整相关引用.
* `./src/styles/index.scss`: 引入自定义样式.
* `./src/store/getters.js`: 新增store属性.
* `./src/store/permission.js`: 用户权限,调整通过接口返回权限.
* `./src/utils/request.js` : HTTP请求,处理相关逻辑.
* `./src/utils/auth.js` : 更改token-key.
* `./src/permission.js` : 定义路由权限.
* `./src/vue.config.js` : 修正开发端口,代理等.
* `./src/router/index.js` : 删除无用路由.
* `./src/layout/components/Navbar.vue` : 调整所使用的组件.
* `./src/layout/components/HeaderSearch/index.vue` : 注释i18n翻译警告.
#### 目录
* `./src/views` : 删除没有使用的页面.    
* `./src/views/login/index.vue` 移到 `./custom/views/login/index.vue`    
* `./src/views/dashboard/index.vue` 移到 `./custom/views/dashboard/index.vue`

## 安装

``` bash
npm install    # npm 安装
```

## 命令

``` bash
npm run dev         # 启动开发模式(dev)
npm run build:prod  # 构建项目
```


