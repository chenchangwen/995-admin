import {param2Obj} from '@/utils';

const userMap = {
    admin: {
        roles: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin',
        password: "123456"
    },
    zhulin: {
        roles: ['test'],
        token: 'test',
        introduction: '我是编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor',
        password: "123456"
    }
}

export default {
    login: config => {
        const {username, password} = JSON.parse(config.body);
        let user = userMap[username];
        if (user && user.password == password) {
            return user;
        }
        else {
            return undefined
        }
    },
    getUserInfo: config => {
        const {token} = param2Obj(config.url);
        if (userMap[token]) {
            return userMap[token]
        } else {
            return false
        }
    },
    logout: () => 'success'
}
