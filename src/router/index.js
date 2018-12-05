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
        redirect: '/expo/exhibition',
        name: 'GET_/authorities/**',
        meta: {
            title: '系统',
            icon: 'example'
        },
        children: [
            {
                path: 'exhibition',
                component: () => import('@/views/expo/exhibition/index'),
                name: 'GET_/authorities/**',
                meta: {
                    title: '权限管理(暂无)',
                }
            },
            // {
            //     path: 'audience',
            //     component: () => import('@/views/expo/audience/index'),
            //     name: 'GET_/resources/**',
            //     meta: {
            //         title: '资源管理(暂无)',
            //     }
            // },
            {
                path: 'user',
                component: () => import('@/views/user/index'),
                name: 'GET_/users/**',
                meta: {
                    title: '用户管理',
                }
            }
        ]
    }
];

