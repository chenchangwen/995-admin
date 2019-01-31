import axios from 'axios'
import {getToken} from '@/utils/auth'
import router from '../router/index'

const service = axios.create({
    baseURL: '/',
    timeout: 10000
});

service.interceptors.request.use(function (config) {
    config.url = '/api' + config.url;
    return config;
}, function (error) {
    return Promise.reject(error);
});


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
                    });
                case 404:
                    router.replace({
                        path: `/login`
                    });
            }
        }
        return Promise.reject(error);
    }
);

export default service;
