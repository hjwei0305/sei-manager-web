import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { assignUsers, removeAssignedUsers } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'moduleTag',

  state: {
    currentModule: null,
    showTagModal: false,
    tagData: null,
    moduleFilter: {},
  },
  effects: {
    *assignUsers({ payload, callback }, { call, put }) {
      const re = yield call(assignUsers, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.assign-success', defaultMessage: '分配成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showAssign: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *removeAssignedUsers({ payload, callback }, { call }) {
      const re = yield call(removeAssignedUsers, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.remove-success', defaultMessage: '移除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
