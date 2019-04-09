# 995-admin
> 后台管理应用脚手架

## Architecture

* `样式`:scss.
* `库管理`:npm
* `基础`:vue-element-admin.
* `框架`:vue2.x.
* `打包`:webpack4.x

调整主要基于 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) .

## 调整方法

尽可能不入侵基础框架`vue-element-admin`.      
业务全部写在`./custom`文件夹.对应相关的文件路径,    
以下文件,目录直接调整
* `./src/main.js`: 调整相关引用
* `./src/styles/index.scss`: 引入自定义样式
* `./src/store/getters.js`: 新增store属性
* `./src/store/permission.js`: 用户权限,调整通过接口返回权限
* `./src/utils/request.js` : HTTP请求,处理相关逻辑
* `./src/permission.js` : 定义路由权限
* `./src/views` : 页面,删除没有使用的页面
* `./src/vue.config.js` : 修正开发端口,代理等

## 安装

``` bash
npm install    # npm 安装
```

## 命令

``` bash
npm run dev         # 启动开发模式(dev)
npm run build:prod  # 构建项目
```


