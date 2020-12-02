import { notification } from 'antd';
import { getSubAppConfig } from '@/services/microFront';
/** 运行时配置文件 */
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      if (err.statusCode !== -1) {
        notification.error({
          message: '接口请求异常',
          description: err.message,
        });
      }
    },
  },
};

export const qiankun = getSubAppConfig();
