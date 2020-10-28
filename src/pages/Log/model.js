import { utils } from 'suid';
import { constants } from '@/utils';

const { ENV_CATEGORY } = constants;
const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const ENV_CATEGORY_DATA = Object.keys(ENV_CATEGORY).map(key => ENV_CATEGORY[key]);

export default modelExtend(model, {
  namespace: 'runtimeLog',

  state: {
    currentEnvViewType: ENV_CATEGORY_DATA[0],
    envViewData: ENV_CATEGORY_DATA,
  },
  effects: {
    // *getDataRoleList({ payload }, { call, put }) {
    //   const re = yield call('', payload);
    //   if (re.success) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         entityNames: re.data,
    //       },
    //     });
    //   }
    // },
  },
});
