export default [
  [
    '@umijs/plugin-qiankun',
    {
      master: {},
    },
  ],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true,
        default: 'zh-CN',
      },
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader',
      },
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
        exclude: ['@babel/runtime', 'netlify-lambda', '@umijs/plugin-qiankun'],
      },
    },
  ],
];
