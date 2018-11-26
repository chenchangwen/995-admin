//登录
export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}

//登出
export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

//用户信息
export function getInfo(token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: {token}
    })
}

