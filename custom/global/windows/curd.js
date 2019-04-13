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

window.curd.queryAdd = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryAddName || '/add'),
        method: 'post',
        data: query
    })
};

window.curd.queryEdit = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryEditName || '/edit'),
        method: 'post',
        data: query
    })
};

window.curd.queryRemove = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryDeleteName || '/delete'),
        method: 'post',
        data: query
    })
};

window.curd.queryCount = function (params, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryCountName || '/count'),
        method: 'get',
        params: params
    })
};

window.curd.queryConfirm = function (query, pageData) {
    return request({
        url: pageData.apiPrefix + (pageData.apiQueryConfirmName),
        method: 'post',
        data: query
    })
};
