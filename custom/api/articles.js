/**
 * 获取最近创建文章草稿
 */
export function draft(userId) {
    return request({
        url: '/articles/draft',
        method: 'post',
        data: {
            userId: userId
        }
    })
}

/**
 * 创建文章草稿
 */
export function draftNew(userId) {
    return request({
        url: '/articles/draft/new',
        method: 'post',
        data: {
            userId: userId
        }
    })
}

/**
 * 编辑文章
 */
export function edit(article) {
    return request({
        url: '/articles/edit',
        method: 'post',
        data: article
    })
}

/**
 * 文章详情
 */
export function articles(id) {
    return request({
        url: '/articles/' + id,
        method: 'get'
    })
}

/**
 * 缩略图
 */
export function addCoverImage(options) {
    return request({
        url: '/articles/medium/image/add/base64',
        method: 'post',
        data: options
    })
}

/**
 * 内容图
 */

export function addContentImage(options) {
    return request({
        url: '/articles/medium/add/base64',
        method: 'post',
        data: options
    })
}


export default {
    draft,
    draftNew,
    edit,
    articles,
    addCoverImage,
    addContentImage
}
