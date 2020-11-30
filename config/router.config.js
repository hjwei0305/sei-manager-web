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
        namd: '系统配置',
        routes: [
          {
            path: '/auth/env',
            name: '环境管理',
            component: './Env',
          },
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
        path: '/integration',
        namd: '持续集成',
        routes: [
          {
            path: '/integration/application',
            name: '应用管理',
            component: './Application',
          },
          {
            path: '/integration/applicationModule',
            name: '模块管理',
            component: './ApplicationModule',
          },
        ],
      },
      {
        path: '/my-center',
        namd: '个人中心',
        routes: [
          {
            path: '/my-center/apply',
            name: '我的申请',
            component: './ApplyOrder',
          },
          {
            path: '/my-center/apply/application',
            name: '应用申请',
            component: './ApplyOrder/Application',
          },
          {
            path: '/my-center/apply/application/new',
            name: '应用申请-新建',
            component: './ApplyOrder/Application',
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
    ],
  },
];

export default routes;
