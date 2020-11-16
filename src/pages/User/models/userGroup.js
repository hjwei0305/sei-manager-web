import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { delUserGroup, saveUserGroup } from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userGroup',

  state: {
    currentUserGroup: null,
    selectedUserGroup: null,
  },
  *saveUserGroup({ payload, callback }, { call, put }) {
    const re = yield call(saveUserGroup, payload);
    message.destroy();
    if (re.success) {
      message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      yield put({
        type: 'updateState',
        payload: {
          currentUserGroup: re.data,
        },
      });
    } else {
      message.error(re.message);
    }
    if (callback && callback instanceof Function) {
      callback(re);
    }
  },
  *delUserGroup({ payload, callback }, { call, put }) {
    const re = yield call(delUserGroup, payload);
    message.destroy();
    if (re.success) {
      message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      yield put({
        type: 'updateState',
        payload: {
          currentUserGroup: null,
        },
      });
    } else {
      message.error(re.message);
    }
    if (callback && callback instanceof Function) {
      callback(re);
    }
  },
});
