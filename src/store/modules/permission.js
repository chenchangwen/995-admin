import {asyncRouterMap, constantRouterMap, resourcesMap} from '../../router/index'
import homeAPI from '../../api/home';
import Layout from '../../views/layout/Layout'

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

/**
 * 获取菜单
 */
function getMenus(menus) {
    menus = menus.filter(function (menu) {
        //一级菜单包上$router属性
        if (!menu.resource) {
            menu.redirect = 'dashboard';
            menu.component = Layout;
            //$router.path 必须存在值,这里使用随机字符串
            //let randomStr = '/' + _.sampleSize(['a', 'c', 'd', 'e', 'f', 'g',
            //    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 's', 'y', 'z'], 10).join('');
            menu.path = '/' + menu.title;
            menu.meta = {
                title: menu.title
            }
        }
        let sum = 0;
        let tempMenu = [];
        let tempChildren = '';
        //二级菜单包上$router属性
        if (!_.isEmpty(menu.children)) {
            for (let i = 0; i < menu.children.length; i++) {
                let item = menu.children[i];
                let resource = resourcesMap[item.resource.url];
                //存在资源
                if (resource) {
                    if (resource.children) {
                        tempChildren = _.assign([], resource.children);
                        delete resource.children;
                    }
                    //合并映射资源
                    item = _.assign({}, item, resource);
                    item.meta = {
                        title: item.title
                    };
                    sum += 1;
                    menu.children[i] = item;
                    tempMenu.push(menu.children[i]);
                }
            }
        }
        if (tempChildren) {
            tempMenu = tempMenu.concat(tempChildren);
        }
        //二级菜单存在资源的数量>0返回该一级菜单(包括二级菜单)
        if (sum > 0) {
            menu.children = tempMenu;
            return menu;
        }
    });
    return menus;
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
            return Promise.all([homeAPI.home(), homeAPI.menus()]).then(function (response) {
                let homeResponse = response[0];
                let menusResponse = response[1];
                let roleCodes = 'user';
                let userName = 'user-name';
                commit('SET_NAME', userName);
                commit('SET_ROLES', roleCodes);
                commit('SET_HOME', homeResponse.data.principal);
                data = roleCodes;
                return new Promise(resolve => {
                    const {roles} = data;
                    // let accessedRouters = filterAsyncRouter(privilegeRouterMap, roles, menuCode);
                    let accessedRouters = getMenus(menusResponse.data);
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
