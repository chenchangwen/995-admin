//home
export function home() {
    return request({
        url: '/home',
        method: 'get'
    })
}

export function menus() {
    return request({
        url: '/home/user/menus',
        method: 'get'
    })
}

export default {
    home,
    menus
}
