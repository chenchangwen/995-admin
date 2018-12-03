//home
export function home() {
    return request({
        url: '/home',
        method: 'get'
    })
}

export default {
    home
}
