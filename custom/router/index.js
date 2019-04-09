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
          title: '文章编辑',
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
  }
};
