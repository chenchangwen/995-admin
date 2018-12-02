/**
 * 全局window配置
 */
import Vue from 'vue'

global.Vue = Vue;

import request from '@/utils/request';

global.request = request;

global.redirectTo = function () {
    location.href = `/#/login?form=${encodeURIComponent(location.href)}`;
};

require('./vendor');
require('./page');
require('./curd');
require('./url-parse');
