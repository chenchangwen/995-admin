/**
 * 全局配置
 */

let config = {
    isMockAPI: false
};

import {configOptions} from './config.options';
config = Object.assign({}, config, configOptions);
if (config.isMockAPI) {
    global.Mock = require('mockjs');
    require('../mock');
}

global.config = config;
