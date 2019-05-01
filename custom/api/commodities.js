/**
 * 获取最近创建产品草稿
 */
export function draft(userId) {
    return request({
        url: '/commodities/draft',
        method: 'post',
        data: {
            userId: userId
        }
    })
}

/**
 * 创建产品草稿
 */
export function draftNew(userId) {
    return request({
        url: '/commodities/draft/new',
        method: 'post',
        data: {
            userId: userId
        }
    })
}

/**
 * 编辑产品
 */
export function edit(article) {
    return request({
        url: '/commodities/edit',
        method: 'post',
        data: article
    })
}

/**
 * 产品详情
 */
export function commodities(id) {
    return request({
        url: '/commodities/' + id,
        method: 'get'
    })
}

/**
 * 缩略图
 */
export function addCoverImage(options) {
    return request({
        url: '/commodities/medium/image/add/base64',
        method: 'post',
        data: options
    })
}

/**
 * 内容图
 */

export function addContentImage(options) {
    return request({
        url: '/commodities/medium/add/base64',
        method: 'post',
        data: options
    })
}


export default {
    draft,
    draftNew,
    edit,
    commodities,
    addCoverImage,
    addContentImage
}
