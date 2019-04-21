import {asyncRoutes, constantRoutes} from '@/router'
import {resourcesRouter} from '../../../custom/router/index'
import homeAPI from '../../../custom/api/home'
import Layout from '../../layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SET_HOME: (state, home) => {
        state.home = home
    }
}

/**
 * 获取菜单
 */
function getMenus(menus) {
    menus = menus.filter(function (menu) {
        //一级菜单包上$router属性
        if (!menu.resource) {
            menu.redirect = 'dashboard';
            menu.component = Layout;
            menu.path = '/' + menu.name;
            // menu.name = menu.title;
            menu.meta = {
                title: menu.name
            }
        }
        let sum = 0;
        let tempMenu = [];
        //二级菜单包上$router属性
        if (!_.isEmpty(menu.children)) {
            for (let i = 0; i < menu.children.length; i++) {
                let item = menu.children[i];
                let resource = resourcesRouter[item.resource.url];
                //存在资源
                if (resource) {
                    if (resource.children) {
                        tempMenu = tempMenu.concat(_.assign([], resource.children));
                        delete resource.children
                    }
                    //合并映射资源
                    item = _.assign({}, item, resource);
                    item.meta = {
                        title: item.name
                    };
                    sum += 1;
                    menu.children[i] = item;
                    tempMenu.push(menu.children[i]);
                }
            }
        }
        //二级菜单存在资源的数量>0返回该一级菜单(包括二级菜单)
        if (sum > 0) {
            menu.children = tempMenu;
            return menu
        }
    });
    return menus
}

const actions = {
    generateRoutes({commit}, roles) {
        return Promise.all([homeAPI.home(), homeAPI.menus()]).then(function (response) {
            let homeResponse = response[0];
            let menusResponse = response[1];
            commit('SET_HOME', homeResponse.data);
            commit('user/SET_ROLES', 1, {root: true});
            return new Promise(resolve => {
                let accessedRouters = getMenus(menusResponse.data);
                accessedRouters = asyncRoutes.concat(accessedRouters);
                console.log(accessedRouters);
                commit('SET_ROUTES', accessedRouters);
                resolve(accessedRouters)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
