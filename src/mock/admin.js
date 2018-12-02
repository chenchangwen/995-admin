export default {
    queryPrivilege: () => {
        return {
            "success": true,
            "model": {
                "id": 2,
                "accountName": "ccw",
                "posts": [
                    {
                        "id": 10,
                        "code": "POST_FRONT_END_DEVELOPER",
                        "name": "前端开发工程师"
                    }
                ],
                "roles": [
                    {
                        "id": 1,
                        "code": "ROLE_955_ADMIN",
                        "name": "管理员角色"
                    }
                ],
                "menus": [
                    {
                        "id": 1,
                        "parentId": 1,
                        "code": "995",
                        "name": "995-admin",
                        "type": 0,
                        "subMenus": [
                            {
                                "id": 2,
                                "parentId": 1,
                                "code": "MENU_EXPO",
                                "name": "智慧会展",
                                "type": 1,
                                "subMenus": [
                                    {
                                        "id": 3,
                                        "parentId": 2,
                                        "code": "MENU_EXPO_EXHIBITION",
                                        "name": "展会管理",
                                        "type": 3,
                                        "operations": [
                                            {
                                                "id": 1,
                                                "code": "MENU_EXPO_EXHIBITION-def",
                                                "name": "查看",
                                                "menuId": 3
                                            },
                                            {
                                                "id": 2,
                                                "code": "OP_EXPO_EXHIBITION_ADD",
                                                "name": "新增展会",
                                                "menuId": 3
                                            },
                                            {
                                                "id": 3,
                                                "code": "OP_EXPO_EXHIBITION_DEL",
                                                "name": "删除展会",
                                                "menuId": 3
                                            },
                                            {
                                                "id": 4,
                                                "code": "OP_EXPO_EXHIBITION_EDIT",
                                                "name": "编辑展会",
                                                "menuId": 3
                                            }
                                        ],
                                        "subMenus": []
                                    },
                                    {
                                        "id": 14,
                                        "parentId": 2,
                                        "code": "MENU_EXPO_AUDIENCE",
                                        "name": "观众管理",
                                        "type": 3,
                                        "operations": [
                                            {
                                                "id": 13,
                                                "code": "MENU_EXPO_AUDIENCE-def",
                                                "name": "查看",
                                                "menuId": 14
                                            }
                                        ],
                                        "subMenus": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "models": []
        }
    }
}
