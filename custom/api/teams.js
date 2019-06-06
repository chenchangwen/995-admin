/**
 * 编辑组队
 */
export function edit(teams) {
    return request({
        url: '/teams/edit',
        method: 'post',
        data: teams
    })
}

/**
 * 组队详情
 */
export function teams(id) {
    return request({
        url: '/teams/' + id,
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
        url: '/teams/medium/content/add/base64',
        method: 'post',
        data: options
    })
}


export default {
    edit,
    teams,
    addCoverImage,
    addContentImage,
    addContactImage
}
