import axios from 'axios'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    withCredentials: true, // 跨域请求时发送 cookies
    timeout: 5000, // request timeout
    headers: { 'accept': 'application/json;charset=utf-8' }
})

// request interceptor
service.interceptors.request.use(function(config) {
    return config
}, function(error) {
    return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        path: `/login`
                    })
                case 404:
                    router.replace({
                        path: `/login`
                    })
                case 500:
                    Vue.prototype.$message({
                        message: error.response.data.message,
                        type: 'error'
                    })
            }
        }
        return Promise.reject(error)
    }
)

export default service
