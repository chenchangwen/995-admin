import loadash from 'lodash';
global._ = loadash;

import viewer from 'v-viewer';
Vue.use(viewer);

import Cookies from 'js-cookie'
global.Cookies = Cookies;

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
