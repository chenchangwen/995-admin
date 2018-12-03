//登录
export function login(username, password) {
    return request({
        url: '/login',
        method: 'post',
        data: {
            username,
            password,
            submit: 'Login'
        }
    })
}


//登出
export function logout() {
    return request({
        url: '/logout',
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

