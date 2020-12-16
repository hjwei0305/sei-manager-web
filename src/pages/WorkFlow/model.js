import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { getFlowTypeList, publishFlowType, saveFlowTypeNode, deleteFlowTypeNode } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
export default modelExtend(model, {
  namespace: 'workflow',

  state: {
    showModal: false,
    currentFlowType: null,
    showFlowHistory: false,
    historyFlowType: null,
    flowTypeData: [],
    rowData: null,
  },
  effects: {
    *getFlowTypeList(_, { call, put }) {
      const re = yield call(getFlowTypeList);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            flowTypeData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *saveFlowTypeNode({ payload, callback }, { call, put }) {
      const re = yield call(saveFlowTypeNode, payload);
      message.destroy();
      if (re.success) {
        message.success('保存成功');
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
    *publishFlowType({ payload, callback }, { call }) {
      const re = yield call(publishFlowType, payload);
      message.destroy();
      if (re.success) {
        message.success('发布成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *deleteFlowTypeNode({ payload, callback }, { call }) {
      const re = yield call(deleteFlowTypeNode, payload);
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
