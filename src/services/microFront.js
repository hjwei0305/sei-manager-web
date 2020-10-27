// import { request } from '@/utils';

export const getSubAppConfig = () =>
  Promise.resolve({
    apps: [
      // {
      //   name: 'sei-basic-web',
      //   entry: `/sei-basic-web?random=${new Date().getTime()}`,
      //   base: '/sei-basic-web',
      // },
      // { name: 'sei-notify-web', entry: '/sei-notify-web', base: '/sei-notify-web' },
      // { name: 'sei-serial-web', entry: '/sei-serial-web', base: '/sei-serial-web' },
      // {
      //   name: 'sei-task-web',
      //   entry: `/sei-task-web?random=${new Date().getTime()}`,
      //   base: '/sei-task-web',
      // },
    ],
    defer: true,
    jsSandbox: false,
    prefetch: true,
    lifeCycles: {
      beforeLoad: props => {
        window.beforeLoadPorps = props;
        // console.log(props, 'beforeLoad');
      },
      beforeMount: props => {
        window.beforeMountPorps = props;
        // console.log(props, 'beforeMount');
      },
      afterMount: props => {
        window.afterMountPorps = props;
        // console.log(props, 'afterMount');
      },
    },
  });
// /** 获取子应用注册表 */
// request
//   .get(`/apps.config.json?random=${new Date().getTime()}`)
//   .then(res => {
//     const { success, data } = res || {};
//     let apps = [];
//     if (success) {
//       apps = data.map(item => item);
//       // apps = data.map(item => {
//       //   item.entry += `/index.html?random=${new Date().getTime()}`;
//       //   return item;
//       // });
//     }

//     return {
//       apps,
//       defer: true,
//       // 是否启用 js 沙箱，默认为 false
//       jsSandbox: false,
//       prefetch: true,
//       // lifeCycles: {
//       //   afterMount: props => {
//       //     /** todo */
//       //   },
//       // },
//     };
//   })
//   .catch(() => ({
//     apps: [],
//     defer: true,
//     jsSandbox: false,
//     prefetch: true,
//     // lifeCycles: {
//     //   afterMount: props => {
//     //     /** todo */
//     //   },
//     // },
//   }));
