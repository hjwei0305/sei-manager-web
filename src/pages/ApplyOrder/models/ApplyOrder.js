import { utils } from 'suid';
import { constants } from '@/utils';

const { APPLY_ORDER_TYPE } = constants;
const APPLY_ORDER_TYPE_DATA = Object.keys(APPLY_ORDER_TYPE)
  .map(key => APPLY_ORDER_TYPE[key])
  .filter(a => a.name !== APPLY_ORDER_TYPE.ALL.name);
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'applyOrder',

  state: {
    currentAppyType: APPLY_ORDER_TYPE_DATA[0],
    appyTypeData: APPLY_ORDER_TYPE_DATA,
  },
  effects: {
    *selectApplyOrderType({ payload }, { put }) {
      const { currentAppyType } = payload;
      yield put({
        type: 'updateState',
        payload: {
          currentAppyType,
        },
      });
    },
  },
});
