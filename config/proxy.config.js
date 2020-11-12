export default {
  '/mocker.api': {
    target: 'http://202.98.157.34:8100/mock/5f98deffbd240382b5a7c400/sei-manager-web',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/api-gateway': {
    target: 'http://dsei.changhong.com',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
