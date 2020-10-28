export default {
  '/mocker.api': {
    target: 'http://202.98.157.34:8100/mock/5f98deffbd240382b5a7c400/sei-manager-web',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/sei-manager': {
    target: 'http://dsei.changhong.com/sei-manager',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/sei-manager': '' },
  },
};
