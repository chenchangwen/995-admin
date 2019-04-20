/**
 * 增删改查
 */
window.curd = {};
window.curd.queryList = function (params, pageData) {
    return request({
        url: pageData.apiPrefix + pageData.apiQueryListUrl,
        method: 'get',
        params: params
    })
};

window.curd.queryAdd = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryAddUrl || '/add'),
        method: 'post',
        data: query
    })
};

window.curd.queryEdit = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryEditUrl || '/edit'),
        method: 'post',
        data: query
    })
};

window.curd.queryRemove = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryDeleteUrl || '/delete'),
        method: 'post',
        data: query
    })
};

window.curd.queryCount = function (params, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryCountUrl || '/count'),
        method: 'get',
        params: params
    })
};

window.curd.queryConfirm = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryConfirmUrl || '/delete'),
        method: 'post',
        data: query
    })
};

window.curd.queryDetail = function (pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryDetailUrl),
        method: 'get',
        params: query
    })
};

window.curd.queryUrl = function (pageData, options) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryUrl),
        method: 'get'
    })
};
