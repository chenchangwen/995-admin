import loginAPI from './login';

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false
    }
    this.proxy_send(...arguments)
};

//权限
import adminAPI from './admin';
Mock.mock(/\/user\/queryPrivilege/, 'get', adminAPI.queryPrivilege);

//登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.login);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo);
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout);


//展会
import expoAPI from './expo';
Mock.mock(/\/expo\/audience\/details/, 'post', expoAPI.queryAudienceList);
Mock.mock(/\/expo\/exhibition\/details/, 'post', expoAPI.queryExhibitionList);

export default Mock;
