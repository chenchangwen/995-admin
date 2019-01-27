require('./config');
require('./global/index');

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control

import * as filters from './filters'

// Vue.use(Element, {
//     size: Cookies.get('size') || 'medium', // set element-ui default size
//     i18n: (key, value) => i18n.t(key, value)
// })

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

Vue.use(ElementUI, {locale});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
});

