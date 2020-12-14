import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { constants } from '../../utils';
import { del, save } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const { APPLY_ORDER_TYPE } = constants;
const APPLY_ORDER_TYPE_DATA = Object.keys(APPLY_ORDER_TYPE)
  .filter(key => APPLY_ORDER_TYPE[key].name !== APPLY_ORDER_TYPE.ALL.name)
  .map(key => APPLY_ORDER_TYPE[key]);

export default modelExtend(model, {
  namespace: 'workflow',

  state: {
    showModal: false,
    currentFlowType: null,
    flowTypeData: APPLY_ORDER_TYPE_DATA,
    rowData: null,
  },
  effects: {
    *save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *del({ payload, callback }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
