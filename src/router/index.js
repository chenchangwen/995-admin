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
    {path: '*', redirect: '/404', hidden: true}
];

export let privilegeRouterMap = [
    {
        path: '/system',
        component: Layout,
        redirect: 'dashboard',
        name: 'GET_/authorities/**',
        meta: {
            title: '系统管理',
            icon: 'example'
        },
        children: [
            {
                path: 'menu',
                component: () => import('@/views/system/menu/index'),
                name: 'GET_/menus/**',
                meta: {
                    title: '系统菜单',
                }
            },
            {
                path: 'resource',
                component: () => import('@/views/system/resource/index'),
                name: 'GET_/resources/**',
                meta: {
                    title: '资源管理',
                }
            },
            {
                path: 'wechat',
                component: () => import('@/views/system/wechats/index'),
                name: 'GET_/wechats/**',
                meta: {
                    title: '微信管理',
                }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: 'dashboard',
        name: 'GET_/users/**',
        meta: {
            title: '用户管理',
            icon: 'user'
        },
        children: [
            {
                path: 'list',
                component: () => import('@/views/user/list/index'),
                name: 'GET_/users/**',
                meta: {
                    title: '用户列表',
                }
            },
            {
                path: 'account',
                component: () => import('@/views/user/account/index'),
                name: 'GET_/users/accounts/**',
                meta: {
                    title: '用户账号',
                }
            },
            {
                path: 'role',
                component: () => import('@/views/user/role/index'),
                name: 'GET_/authorities/roles/**',
                meta: {
                    title: '用户角色',
                }
            },
        ]
    },
    {
        path: '/sms',
        component: Layout,
        redirect: 'dashboard',
        name: 'GET_/sms/**',
        meta: {
            title: '消息中心',
            icon: 'message'
        },
        children: [
            {
                path: 'user',
                component: () => import('@/views/message/user/index'),
                name: 'GET_/users/messages/**',
                meta: {
                    title: '用户消息',
                }
            },
            {
                path: 'wechat-text',
                component: () => import('@/views/message/wechat-text/index'),
                name: 'GET_/wechats/users/messages/texts/**',
                meta: {
                    title: '微信文本消息',
                }
            },
            {
                path: 'wechat-template',
                component: () => import('@/views/message/wechat-template/index'),
                name: 'GET_/wechats/users/messages/templates/**',
                meta: {
                    title: '微信模板消息',
                }
            },
            {
                path: 'wechat',
                component: () => import('@/views/message/wechat-format/index'),
                name: 'GET_/wechats/users/messages/templates/formats/**',
                meta: {
                    title: '微信消息模板',
                }
            }
        ]
    },
    {
        path: '/document',
        component: Layout,
        redirect: 'dashboard',
        name: 'GET_/classifies/**',
        meta: {
            title: '文档管理',
            icon: 'documentation'
        },
        children: [
            {
                path: 'classifies',
                component: () => import('@/views/classifies/index'),
                name: 'GET_/classifies/**',
                meta: {
                    title: '分类管理',
                }
            },
            {
                path: 'articles',
                component: () => import('@/views/articles/index'),
                name: 'GET_/articles/**',
                meta: {
                    title: '文章管理',
                }
            },
            {
                path: 'articles/edit/:id?',
                component: () => import('@/views/articles/edit'),
                name: 'POST_/articles/**',
                meta: {
                    title: '文章编辑',
                },
                hidden: true
            }
        ]
    }
];

