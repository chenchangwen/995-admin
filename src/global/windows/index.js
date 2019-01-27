/**
 * 全局window配置
 */
import Vue from 'vue'

Vue.prototype.global = {};

global.Vue = Vue;

window.admin995 ={};

import request from '@/utils/request';

global.request = request;

global.redirectTo = function () {
    location.href = `/#/login?form=${encodeURIComponent(location.href)}`;
};

require('./vendor');
require('./page');
require('./curd');
require('./url-parse');
require('./config');