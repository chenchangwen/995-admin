//home
export function home() {
    return request({
        url: '/api/home',
        method: 'get'
    })
}

export default {
    home
}
