/**
 * 添加webpack配置
 * @param  {object} config
 */
export const webpackPlugin = () => {
  /** 处理webpack配置 */
  // if (process.env.NODE_ENV === 'production') {
  //   config.plugin('sentry').use(SentryPlugin, [
  //     {
  //       release: process.env.RELEASE_VERSION,
  //       ignore: ['node_modules'],
  //       include: path.join(__dirname, '../dist/'),
  //       deleteAfterCompile: true,
  //       configFile: '../.sentryclirc', //配置文件地址
  //       urlPrefix: '~/sei-portal-web',
  //     },
  //   ]);
  // }
};
