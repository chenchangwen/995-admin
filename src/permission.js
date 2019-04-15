import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration


router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
    NProgress.done();
  }
  else {
    NProgress.start();
    if (getToken()) {
      //判断当前用户是否已拉取完user_info信息
      if (store.getters.roles.length === 0) {
        //根据roles权限生成可访问的路由表
        store.dispatch('permission/generateRoutes').then(() => {
          //动态添加可访问路由表
          router.addRoutes(store.getters.addRoutes);
          //hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          next({...to, replace: true})
        }).catch((err) => {
          store.dispatch('user/resetToken').then(() => {
            // Message.error(err || 'Verification failed, please login again');
            next({path: '/'});
          })
          NProgress.done()
        })
      } else {
          setRouterTile(to);
        next()
      }
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});


function setRouterTile(to) {
    if(to.meta.title) {
        to.meta.title = to.meta.title.replace(/新增/, '').replace(/编辑/, '')
        if (to.path.indexOf('edit') > -1) {
            if (to.params.id) {
                to.meta.title = ('编辑' + to.meta.title)
            } else {
                to.meta.title = ('新增' + to.meta.title)
            }
        }
    }
}
