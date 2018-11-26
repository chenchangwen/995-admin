import loadash from 'lodash';
global._ = loadash;

import viewer from 'v-viewer';
Vue.use(viewer);


import Cookies from 'js-cookie'
global.Cookies = Cookies;
