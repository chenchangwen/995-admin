/**
 * 编辑活动
 */
export function edit(activity) {
    return request({
        url: '/activities/edit',
        method: 'post',
        data: activity
    })
}

/**
 * 活动详情
 */
export function activities(id) {
    return request({
        url: '/activities/' + id,
        method: 'get'
    })
}

/**
 * 缩略图
 */
export function addCoverImage(options) {
    return request({
        url: '/activities/medium/image/replace/base64',
        method: 'post',
        data: options
    })
}

/**
 * 联系方式图
 */

export function addContactImage(options) {
    return request({
        url: '/activities/medium/contact/image/replace/base64',
        method: 'post',
        data: options
    })
}


/**
 * 内容图
 */

export function addContentImage(options) {
    return request({
        url: '/activities/medium/content/add/base64',
        method: 'post',
        data: options
    })
}


export default {
    edit,
    activities,
    addCoverImage,
    addContentImage,
    addContactImage
}
