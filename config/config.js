import { resolve } from 'path';
import { webpackPlugin as chainWebpack } from './chain.webpack.config';
import plugins from './plugin.config';
import routes from './router.config';
import proxy from './proxy.config';
import themeConfig from './theme.config';

const basePath = '/sei-manager-web/';
export default {
  history: 'hash',
  treeShaking: true,
  ignoreMomentLocale: true,
  targets: { ie: 11 },
  // base: basePath,
  publicPath: basePath,
  hash: true,
  plugins,
  routes,
  proxy,
  theme: themeConfig(),
  alias: {
    '@': resolve(__dirname, './src'),
  },
  define: {
    'process.env.MOCK': process.env.MOCK,
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'suid',
        libraryDirectory: 'es',
        style: true,
      },
      'suid',
    ],
  ],
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack,
};
