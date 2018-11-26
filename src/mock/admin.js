import {param2Obj} from '@/utils';
export default {
    queryPrivilege: () => {
        return {
            "success": true,
            "model":
                {
                    "id": 1,
                    "accountName": "admin",
                    "posts": [
                        {
                            "id": 1,
                            "code": "POST_OPS_MANAGER",
                            "name": "运营经理"
                        }],
                    "roles": [
                        {
                            "id": 1,
                            "code": "ROLE_OSS_ADMIN",
                            "name": "OSS管理员"
                        }],
                    "menus": [
                        {
                            "id": 1,
                            "code": "MENU_EXPO_MANAGE",
                            "name": "展会管理",
                            "type": 1,
                            "subMenus": [
                                {
                                    "id": 2,
                                    "parentId": 1,
                                    "code": "MENU_EXPO_EXHIBITOR_MANAGE",
                                    "name": "参展商管理",
                                    "type": 2,
                                    "operations": [
                                        {
                                            "id": 1,
                                            "code": "OP_EXPO_EXHIBITOR_ADD",
                                            "name": "新增参展商"
                                        },
                                        {
                                            "id": 2,
                                            "code": "OP_EXPO_EXHIBITOR_DEL",
                                            "name": "删除参展商"
                                        }]
                                },
                                {
                                    "id": 3,
                                    "parentId": 1,
                                    "code": "MENU_EXPO_AUDIENCE_MANAGE",
                                    "name": "观众管理",
                                    "type": 2,
                                    "operations": [
                                        {
                                            "id": 1,
                                            "code": "OP_EXPO_AUDIENCE_ADD",
                                            "name": "新增观众"
                                        },
                                        {
                                            "id": 2,
                                            "code": "OP_EXPO_AUDIENCE_DEL",
                                            "name": "删除观众"
                                        }]
                                }]
                        }]
                },
            "models": []
        };
    }
}
