# 995-admin
> 后台管理应用脚手架

## Architecture

* `样式`:scss.
* `库管理`:npm
* `基础`:vue-element-admin2.9.2.
* `框架`:vue2.x.
* `打包`:webpack4.x

调整主要基于 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) .

## 安装

``` bash
npm install    # npm 安装
```

## 命令

``` bash
npm run dev         # 启动开发模式(dev)
npm run build:prod  # 构建项目
```

## 跨域配置(可选)

* `hosts`
```hosts
...
127.0.0.1 995-admin.com
...
```

* `porxy`
```nginx.conf
...
proxyTable: {
    '/api': {
        target: `http://beta.buchuju.net:8080`,
        pathRewrite: {
           '^/api': '/'
        }
      }
    },
...
```

