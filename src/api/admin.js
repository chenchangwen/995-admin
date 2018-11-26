/**
 * 查询权限
 */
export function queryPrivilege() {
    return request({
        url: '/user/queryPrivilege',
        method: 'get',
        params: {
            appCode: 'ADMIN_OSS'
        }
    })
};

export default {
    queryPrivilege
}
