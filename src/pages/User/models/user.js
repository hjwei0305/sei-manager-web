import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { delUser, saveUser, getUserItemList } from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'authUser',

  state: {
    listData: [],
    currentUser: null,
    showFormModal: false,
  },
  effects: {
    *getUserItemList({ payload }, { call, put }) {
      const re = yield call(getUserItemList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            listData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *saveUser({ payload, callback }, { call, put }) {
      const re = yield call(saveUser, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showFormModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delUser({ payload, callback }, { call }) {
      const re = yield call(delUser, payload);
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
