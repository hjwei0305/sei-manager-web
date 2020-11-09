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
