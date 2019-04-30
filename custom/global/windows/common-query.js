/**
 * 通用数据请求
 */

function queryData(options) {
    let requestObj = options.pageData.request || {};
    let requestKey = requestObj[options.requestKey] || '';
    let queryPrefix = requestObj.queryPrefix || '';
    let query = {
        url: queryPrefix + ((requestKey.url || options.url) || ''),
        method: requestKey.method || options.method
    }

    let queryDataKey = 'data'
    if (query.method === 'get') {
        queryDataKey = 'params'
    }
    query[queryDataKey] = options.pageData.query
    return request(query)
}

export function queryList(pageData) {
    let options = {
        method: 'get',
        requestKey: 'queryList',
        pageData: pageData
    }
    return queryData(options)
}

export function queryDetail(pageData) {
    let options = {
        method: 'get',
        requestKey: 'queryDetail',
        pageData: pageData
    }
    return queryData(options)
}

export function queryAdd(pageData) {
    let options = {
        method: 'post',
        url: '/add',
        requestKey: 'queryAdd',
        pageData: pageData
    }
    return queryData(options)
}

export function queryEdit(pageData) {
    let options = {
        method: 'post',
        url: '/edit',
        requestKey: 'queryEdit',
        pageData: pageData
    }
    return queryData(options)
}

export function queryConfirm(pageData) {
    let options = {
        method: 'post',
        url: '/delete',
        requestKey: 'queryConfirm',
        pageData: pageData
    }
    return queryData(options)
}

export function query(pageData) {
    let options = {
        method: 'get',
        requestKey: 'query',
        pageData: pageData
    }
    return queryData(options)
}

export function queryCount(pageData) {
    let options = {
        method: 'get',
        url: '/count',
        requestKey: 'queryCount',
        pageData: pageData
    }
    return queryData(options)
}
