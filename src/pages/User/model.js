import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { editSave, createdSave, assignRoles, removeAssignedRoles } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userList',

  state: {
    rowData: null,
    showModal: false,
    showAssignedRoleModal: false,
    currentAssignUser: null,
  },
  effects: {
    *createdSave({ payload, callback }, { call, put }) {
      const re = yield call(createdSave, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *editSave({ payload, callback }, { call, put }) {
      const re = yield call(editSave, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignRoles({ payload, callback }, { call }) {
      const re = yield call(assignRoles, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.assign-success', defaultMessage: '分配成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *removeAssignedRoles({ payload, callback }, { call }) {
      const re = yield call(removeAssignedRoles, payload);
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
