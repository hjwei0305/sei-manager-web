import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { constants } from '@/utils';
import { approve, stopApprove } from '../services/service';
import { del, editSave, createSave, getPublish } from '../services/applyDeploy';

const { FLOW_OPERATION_TYPE } = constants;
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'applyDeploy',

  state: {
    rowData: null,
    showModal: false,
    onlyView: false,
    filter: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/my-center/apply/deploy/new', location.pathname)) {
          dispatch({
            type: 'updateState',
            payload: {
              rowData: null,
              showModal: true,
            },
          });
        }
      });
    },
  },
  effects: {
    *createSave({ payload, callback }, { call, put }) {
      const re = yield call(createSave, payload);
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
    *getPublish({ payload, callback }, { call, put }) {
      const re = yield call(getPublish, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            rowData: re.data,
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
      const data = { ...payload };
      Object.assign(data, { id: data.id });
      const re = yield call(editSave, data);
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
    *saveToApprove({ payload, callback }, { call }) {
      const data = { ...payload };
      let re;
      if (data.id) {
        Object.assign(data, { id: data.relationId });
        re = yield call(editSave, data);
      } else {
        re = yield call(createSave, data);
      }
      message.destroy();
      if (re.success && re.data) {
        const res = yield call(approve, {
          requisitionId: re.data.id,
          flowTypeId: 2,
          flowTypeName: '模块申请',
        });
        if (res.success) {
          message.success('保存并提交审核成功');
        } else {
          message.error(res.message);
        }
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *approve({ payload, callback }, { call }) {
      const data = { ...payload };
      const re = yield call(approve, {
        requisitionId: data.id,
        flowTypeId: 2,
        flowTypeName: '模块申请',
      });
      message.destroy();
      if (re.success) {
        message.success('提交审核成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *stopApprove({ payload, callback }, { call }) {
      const { messageText, id } = payload;
      const re = yield call(stopApprove, {
        message: messageText,
        requisitionId: id,
        operationType: FLOW_OPERATION_TYPE.CANCEL,
      });
      message.destroy();
      if (re.success) {
        message.success('已经终止审核');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
