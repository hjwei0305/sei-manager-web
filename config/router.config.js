const routes = [
  {
    path: '/user',
    component: '../layouts/TempLoginLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './Login',
      },
    ],
  },
  {
    name: 'updatePwd',
    path: '/updatePwd',
    component: './UpdatePassword',
  },
  {
    name: 'retrievePwd',
    path: '/retrievePwd',
    component: './RetrievePwd',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['./src/components/PrivateRoute'],
    routes: [
      {
        path: '/',
        redirect: '/dashBoard',
      },
      {
        path: '/dashBoard',
        name: 'Dashboard',
        component: './Dashboard',
      },
      {
        path: '/deploy',
        namd: '部署管理',
        routes: [
          {
            path: '/deploy/certificate',
            name: '凭证管理',
            component: './Certificate',
          },
          {
            path: '/deploy/serverNode',
            name: '服务器节点管理',
            component: './ServerNode',
          },
          {
            path: '/deploy/deployStage',
            name: '部署阶段管理',
            component: './DeployStage',
          },
          {
            path: '/deploy/deployTemplate',
            name: '部署模板管理',
            component: './DeployTemplate',
          },
        ],
      },
      {
        path: '/auth',
        namd: '后台配置',
        routes: [
          {
            path: '/auth/feature',
            name: '功能项',
            component: './Feature',
          },
          {
            path: '/auth/menu',
            name: '菜单管理',
            component: './Menu',
          },
          {
            path: '/auth/featureRole',
            name: '角色管理',
            component: './FeatureRole',
          },
          {
            path: '/auth/userGroup',
            name: '用户组',
            component: './UserGroup',
          },
          {
            path: '/auth/userList',
            name: '用户',
            component: './User',
          },
        ],
      },
      {
        path: '/log',
        namd: '日志分析',
        routes: [
          {
            path: '/log/logRecord',
            name: 'Log',
            component: './Log',
          },
        ],
      },
      {
        path: '/service',
        namd: '服务',
        routes: [
          {
            path: '/service/view',
            name: '可用服务',
            component: './AvailableService',
          },
        ],
      },
      {
        path: '/model',
        namd: '数据模型',
        routes: [
          {
            path: '/model/dataSource',
            name: '数据源',
            component: './DataModel/DataSource',
          },
          {
            path: '/model/elementLibrary',
            name: '元素库',
            component: './DataModel/ElementLibrary',
          },
          {
            path: '/model/labelLibrary',
            name: '标签库',
            component: './DataModel/LabelLibrary',
          },
          {
            path: '/model/dataType',
            name: '数据类型',
            component: './DataModel/DataType',
          },
          {
            path: '/model/dataModel',
            name: '数据类型',
            component: './DataModel/DataModelManager',
          },
        ],
      },
      {
        path: '/app',
        namd: '数据模型',
        routes: [
          {
            path: '/app/deployJob',
            name: '部署配置',
            component: './Application/DeployJob',
          },
          {
            path: '/app/project',
            name: '部署配置',
            component: './Application/Project',
          },
          {
            path: '/app/appModule',
            name: '部署配置',
            component: './Application/AppModule',
          },
        ],
      },
    ],
  },
];

export default routes;
