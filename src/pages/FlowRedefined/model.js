import { get } from 'lodash';
import { utils, message } from 'suid';
import { constants } from '@/utils';
import { getRedefinedTypes, getFlowInstanceTask, saveInstanceTask } from './service';

const { APPLY_ORDER_TYPE } = constants;
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'flowRedefined',

  state: {
    redefinedTypeData: [],
    currentModule: null,
    moduleFilter: {},
    currentTabKey: '',
    typeNodeData: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/auth/flowRedefined', location.pathname)) {
          dispatch({
            type: 'getRedefinedTypes',
          });
        }
      });
    },
  },
  effects: {
    *getRedefinedTypes(_, { call, put }) {
      const re = yield call(getRedefinedTypes);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            redefinedTypeData: re.data || [],
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *saveInstanceTask({ payload, callback }, { call }) {
      const re = yield call(saveInstanceTask, payload);
      message.destroy();
      if (re.success) {
        message.success('保存成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getFlowInstanceTask({ payload }, { call, put, select }) {
      const { currentTabKey: originTabKey, redefinedTypeData, typeNodeData } = yield select(
        sel => sel.flowRedefined,
      );
      const { currentModule } = payload;
      let currentTabKey = APPLY_ORDER_TYPE.PUBLISH.name;
      let redefinedType = {};
      if (redefinedTypeData.length > 0) {
        [redefinedType] = redefinedTypeData;
        currentTabKey = redefinedType.code;
      }
      if (originTabKey) {
        const rt = redefinedTypeData.filter(r => r.code === originTabKey);
        redefinedType = rt.length > 0 ? rt[0] : {};
      }
      currentTabKey = originTabKey || currentTabKey;
      const re = yield call(getFlowInstanceTask, {
        relation: get(currentModule, 'id'),
        typeCode: get(redefinedType, 'code'),
        version: get(redefinedType, 'version'),
      });
      if (re.success) {
        typeNodeData[currentTabKey] = re.data || [];
        yield put({
          type: 'updateState',
          payload: {
            currentTabKey,
            currentModule,
            typeNodeData,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
  },
});
