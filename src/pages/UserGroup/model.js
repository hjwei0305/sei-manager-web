import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { delUserGroup, saveUserGroup, assignUsers, removeAssignedUsers } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userGroup',

  state: {
    currentUserGroup: null,
    selectedUserGroup: null,
    showAssign: false,
  },
  effects: {
    *saveUserGroup({ payload, callback }, { call, put }) {
      const re = yield call(saveUserGroup, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            selectedUserGroup: re.data,
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
            selectedUserGroup: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
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
