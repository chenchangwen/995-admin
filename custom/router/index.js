export let resourcesRouter = {
    '/menus/**': {
        path: 'menu',
        component: () => import('../views/resources/menu/index'),
    },
    '/resources/**': {
        path: 'resource',
        component: () => import('../views/resources/resource/index'),
    },
    '/wechats/**': {
        path: 'wechat',
        component: () => import('../views/resources/wechats/index'),
    },
    '/users/**': {
        path: 'user',
        component: () => import('../views/resources/user/list/index'),
    },
    '/authorities/roles/**': {
        path: 'role',
        component: () => import('../views/resources/user/role/index'),
    },
    '/users/accounts/**': {
        path: 'account',
        component: () => import('../views/resources/user/account/index'),
    },
    //微信文本消息
    '/wechats/users/messages/texts/**': {
        path: 'wechat-text',
        component: () => import('../views/resources/message/wechat-text/index'),
    },
    //微信消息模版
    '/wechats/users/messages/templates/formats/**': {
        path: 'wechat-format',
        component: () => import('../views/resources/message/wechat-format/index'),
    },
    //微信消息
    '/wechats/users/messages/templates/**': {
        path: 'wechat-template',
        component: () => import('../views/resources/message/wechat-template/index'),
    },
    //文章
    '/articles/**': {
        path: 'articles',
        component: () => import('../views/resources/articles/index'),
        children: [
            {
                name: 'articles-edit',
                path: 'articles/edit/:id?',
                component: () => import('../views/resources/articles/edit'),
                meta: {
                    title: '文章',
                },
                hidden: true,
                children: []
            }
        ]
    },
    //自定义分类
    '/classifies/**': {
        path: 'classifies',
        component: () => import('../views/resources/classifies/index'),
    },
    //用户消息
    '/users/messages/**': {
        path: 'user',
        component: () => import('../views/resources/message/user/index'),
    },
    //用户消息模版
    '/users/messages/formats/**': {
        path: 'user-format',
        component: () => import('../views/resources/message/user-format/index'),
    },
    //短信
    '/sms/**': {
        path: 'sms',
        component: () => import('../views/resources/message/sms/index'),
    },
    //短信模版
    '/sms/templates/**': {
        path: 'sms-template',
        component: () => import('../views/resources/message/sms-template/index'),
    },
    //订单
    '/orders/**': {
        path: 'order',
        component: () => import('../views/resources/order/list/index'),
    },
    //订单退款
    '/orders/refunds/**':{
        path: 'order-refund',
        component: () => import('../views/resources/order/refund/index'),
    },
    //积分
    '/cents/**':{
        path: 'cent',
        component: () => import('../views/resources/cent/list/index'),
    },
    //积分提现
    '/cents/cashes/**':{
        path: 'cent-cash',
        component: () => import('../views/resources/cent/cash/index'),
    },
    //积分变更
    '/cents/changes/**':{
        path: 'cent-change',
        component: () => import('../views/resources/cent/change/index'),
    },
    //积分转账
    '/cents/transfers/**':{
        path: 'cent-transfer',
        component: () => import('../views/resources/cent/transfer/index'),
    }
};
