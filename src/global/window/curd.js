/**
 * 增删改查
 */
window.curd = {};
window.curd.queryList = function (params, pageData) {
    return request({
        url: pageData.apiPrefix + pageData.apiQueryListName,
        method: 'get',
        params: params
    })
};

window.curd.queryAdd = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/add',
        method: 'post',
        data: query
    })
};

window.curd.queryEdit = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/edit',
        method: 'post',
        data: query
    })
};

window.curd.queryRemove = function (query, apiPrefix) {
    return request({
        url: apiPrefix + '/delete',
        method: 'post',
        data: query
    })
};

window.curd.queryCount = function (params, apiPrefix) {
    return request({
        url: apiPrefix + '/count',
        method: 'get',
        params: params
    })
};