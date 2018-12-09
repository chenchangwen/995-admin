/**
 * 增删改查
 */
window.curd = {};
window.curd.queryList = function (params, apiPrefix) {
    return request({
        url: apiPrefix + '/details',
        method: 'get',
        params: params
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

window.curd.remove = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/delete',
        method: 'post',
        data: query
    })
};

window.curd.count = function (params, apiPrefix) {
    return request({
        url: apiPrefix + '/count',
        method: 'get',
        params: params
    })
};