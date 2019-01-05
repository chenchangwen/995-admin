import {asyncRouterMap, constantRouterMap, privilegeRouterMap} from '@/router'
import homeAPI from '../../api/home';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0``)
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles, menuCode) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route) && menuCode.indexOf(route.name) > -1) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles, menuCode)
            }
            return true
        }
        return false
    });
    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return homeAPI.home().then(response => {
                //菜单
                let authorities = response.data.base.authorities;
                let menuCode = [];

                let roleCodes = 'user';
                let userName = 'user-name';
                commit('SET_NAME', userName);
                commit('SET_ROLES', roleCodes);
                data = roleCodes;

                authorities.forEach(function (item) {
                    if (item.authority.indexOf('GET') >= 0) {
                        menuCode.push(item.authority);
                    }
                });

                return new Promise(resolve => {
                    const {roles} = data;
                    let accessedRouters = filterAsyncRouter(privilegeRouterMap, roles, menuCode);
                    accessedRouters = asyncRouterMap.concat(accessedRouters);
                    console.log(accessedRouters);
                    commit('SET_ROUTERS', accessedRouters);
                    resolve()
                })
            });
        }
    }
}

export default permission
