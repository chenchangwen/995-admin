/**
 * 查询基本权限信息
 */
export function authorities(params) {
    let defaults = {
        page: 0,
        size: 500
    };
    let options = Object.assign({}, defaults ,params);
    return request({
        url: '/authorities',
        method: 'get',
        params: options
    })
}

export default {
    authorities
}
