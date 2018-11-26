import router from './router';
import store from './store';
import {Message} from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {getToken} from '@/utils/auth';

NProgress.configure({showSpinner: false});

router.beforeEach((to, from, next) => {
    if(to.fullPath ==='/login'){
        next();
        NProgress.done();
    }
    else {
        NProgress.start();
        if (getToken()) {
            console.log(store.getters)
            //判断当前用户是否已拉取完user_info信息
            if (store.getters.roles.length === 0) {
                //根据roles权限生成可访问的路由表
                store.dispatch('GenerateRoutes').then(() => {
                    //动态添加可访问路由表
                    router.addRoutes(store.getters.addRouters);
                    //hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    next({...to, replace: true})
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || 'Verification failed, please login again');
                        //redirectTo();
                        next()
                    })
                })
            } else {
                next()
            }
        } else {
            next(`/login`);
            NProgress.done()
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
