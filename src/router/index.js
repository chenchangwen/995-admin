import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
    {path: '/login', component: () => import('@/views/login/index'), hidden: true},
    {path: '/404', component: () => import('@/views/404'), hidden: true},
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
            component: () => import('@/views/dashboard/index'),
            name: 'dashboard',
            meta: {title: '主页', icon: 'dashboard', noCache: true}
        }]
    },
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

export let asyncRouterMap = [
    {path: '*', redirect: '/404', hidden: true},
    {
        path: 'articles/edit/:id?',
        component: () => import('@/views/resources/articles/edit'),
        meta: {
            title: '文章编辑',
        },
        hidden: true
    }
];


export let resourcesMap = {
    '/menus/**': {
        path: 'menu',
        component: () => import('@/views/resources/menu/index'),
    },
    '/resources/**': {
        path: 'resource',
        component: () => import('@/views/resources/resource/index'),
    },
    '/wechats/**':{
        path: 'wechat',
        component: () => import('@/views/resources/wechats/index'),
    },
    '/users/**':{
        path: 'user',
        component: () => import('@/views/resources/user/list/index'),
    },
    '/authorities/roles/**':{
        path: 'role',
        component: () => import('@/views/resources/user/role/index'),
    },
    '/users/accounts/**':{
        path: 'account',
        component: () => import('@/views/resources/user/account/index'),
    },
    //微信文本消息
    '/wechats/users/messages/texts/**':{
        path: 'wechat-text',
        component: () => import('@/views/resources/message/wechat-text/index'),
    },
    //微信消息模版
    '/wechats/users/messages/templates/formats/**':{
        path: 'wechat-format',
        component: () => import('@/views/resources/message/wechat-format/index'),
    },
    //微信消息
    '/wechats/users/messages/templates/**':{
        path: 'wechat-template',
        component: () => import('@/views/resources/message/wechat-template/index'),
    },
    //文章
    '/articles/**':{
        path: 'articles',
        component: () => import('@/views/resources/articles/index'),
    },
    //自定义分类
    '/classifies/**':{
        path: 'classifies',
        component: () => import('@/views/resources/classifies/index'),
    }
};

