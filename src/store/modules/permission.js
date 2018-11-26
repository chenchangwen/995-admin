import {asyncRouterMap, constantRouterMap, privilegeRouterMap} from '@/router'
import adminAPI from '../../api/admin';
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0)
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
    })
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
        GenerateRoutes({ commit }, data) {
            return adminAPI.queryPrivilege().then(response => {
                //所有菜单code
                let menuCode = [];
                let menus = response.data.model.menus;
                let roles = response.data.model.roles;

                if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    let roleCodes = roles.map((b)=>b.code);
                    commit('SET_ROLES', roleCodes);
                    data = roleCodes;
                }

                menus.forEach(function (menuItem) {
                    menuCode.push(menuItem.code);
                    if (menuItem.subMenus) {
                        menuItem.subMenus.forEach(function (subItem) {
                            menuCode.push(subItem.code);
                            if (subItem.subMenus) {
                                subItem.subMenus.forEach(function (subItem1) {
                                    menuCode.push(subItem1.code);
                                })
                            }
                        });
                    }
                });
                console.log(`menu code ${menuCode}`);

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
