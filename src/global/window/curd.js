/**
 * 增删改查
 */
window.curd = {};
window.curd.queryList = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/queryList',
        method: 'post',
        data: query
    })
};

window.curd.add = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/add',
        method: 'post',
        data: query
    })
};

window.curd.edit = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/edit',
        method: 'post',
        data: query
    })
};

window.curd.remove = function (params, apiPrefix) {
    return request({
        url: apiPrefix + '/delete',
        method: 'post',
        params
    })
};

