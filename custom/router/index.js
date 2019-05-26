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
        children: [
            {
                name: 'classifies-edit',
                path: 'classifies/edit/:id',
                component: () => import('../views/resources/classifies/edit'),
                meta: {
                    title: '编辑分类',
                },
                hidden: true,
                children: []
            }
        ]
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
    },
    //关系返点定义
    '/relations/kickbacks/**':{
        path: 'relations-kickbacks',
        component: () => import('../views/resources/relations/kickback/index'),
    },
    //返点日志
    '/relations/kickbacks/logs/**':{
        path: 'relations-logs',
        component: () => import('../views/resources/relations/log/index'),
    },
    //关系用户
    '/relations/users/**':{
        path: 'relations-users',
        component: () => import('../views/resources/relations/user/index'),
    },
    //网站
    '/sites/**':{
        path: 'site',
        component: () => import('../views/resources/site/list/index'),
        children: [
            {
                name: 'site-edit',
                path: 'site/edit/:id?',
                component: () => import('../views/resources/site/list/edit'),
                meta: {
                    title: '网站',
                },
                hidden: true,
                children: []
            }
        ]
    },
    //网站模版
    '/sites/themes/**':{
        path: 'sites-themes',
        component: () => import('../views/resources/site/theme/index'),
    },
    //评论
    '/comments/**':{
        path: 'comment',
        component: () => import('../views/resources/comment/list/index'),
    },
    //评论
    '/faqs/**':{
        path: 'faq',
        component: () => import('../views/resources/faq/index'),
    },
    //评论
    '/commodities/**':{
        path: 'commodity',
        component: () => import('../views/resources/commodity/index'),
        children: [
            {
                name: 'commodity-edit',
                path: 'commodity/edit/:id?',
                component: () => import('../views/resources/commodity/edit'),
                meta: {
                    title: '产品',
                },
                hidden: true,
                children: []
            }
        ]
    },
    //活动(暂用众筹路由)
    '/crowds/**':{
        path: 'activity',
        component: () => import('../views/resources/activity/index'),
        children: [
            {
                name: 'activity-edit',
                path: 'activity/edit/:id',
                component: () => import('../views/resources/activity/edit'),
                meta: {
                    title: '活动',
                },
                hidden: true,
                children: []
            },
            {
                name: 'activity-pending',
                path: 'activity/pending',
                component: () => import('../views/resources/activity/pending'),
                meta: {
                    title: '待审核活动',
                },
                hidden: true,
                children: []
            }
        ]
    },
};
