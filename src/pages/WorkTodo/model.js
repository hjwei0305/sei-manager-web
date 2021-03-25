import { utils, message } from 'suid';
import { constants } from '../../utils';
import {
  getTypeTodoList,
  submitHanlder,
  getTodoList,
  getApplicationDetail,
  getAppModuleDetail,
  getReleaseDetail,
  getDeployDetail,
  getTag,
} from './service';

const { APPLY_ORDER_TYPE } = constants;
const APPLY_ORDER_TYPE_DATA = Object.keys(APPLY_ORDER_TYPE).map(key => APPLY_ORDER_TYPE[key]);
const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'taskWorkTodo',

  state: {
    viewTypeData: APPLY_ORDER_TYPE_DATA,
    currentViewType: APPLY_ORDER_TYPE_DATA[0],
    todoData: [],
    showApplicationDetail: false,
    showAppModuleDetail: false,
    showReleaseDetail: false,
    showDeployDetail: false,
    detailId: '',
    detailData: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/my-center/workTodo', location.pathname)) {
          const { t } = location.query;
          const viewType = APPLY_ORDER_TYPE_DATA.filter(v => v.name === t);
          dispatch({
            type: 'getTypeTodoList',
            payload: {
              init: true,
              currentViewType: viewType.length === 1 ? viewType[0] : null,
            },
          });
        }
      });
    },
  },
  effects: {
    *getTypeTodoList({ payload }, { call, put }) {
      const { currentViewType } = payload;
      if (currentViewType) {
        const re = yield call(getTypeTodoList, { type: currentViewType.name });
        if (re.success) {
          yield put({
            type: 'updateState',
            payload: {
              todoData: re.data,
              currentViewType,
            },
          });
        } else {
          message.destroy();
          message.error(re.message);
        }
      } else {
        message.destroy();
        message.error('未指定待办申请类型');
      }
    },
    *getWorkTodoList({ payload }, { call, put }) {
      const { currentViewType } = payload;
      if (currentViewType) {
        let re;
        if (currentViewType.name === APPLY_ORDER_TYPE.ALL.name) {
          re = yield call(getTodoList);
        } else {
          re = yield call(getTypeTodoList, { type: currentViewType.name });
        }
        if (re.success) {
          yield put({
            type: 'updateState',
            payload: {
              todoData: re.data,
              currentViewType,
            },
          });
        } else {
          message.destroy();
          message.error(re.message);
        }
      } else {
        message.destroy();
        message.error('未指定待办申请类型');
      }
    },
    *submitHanlder({ payload, callback }, { call }) {
      const re = yield call(submitHanlder, payload);
      message.destroy();
      if (re.success) {
        message.success('处理成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getDetail({ payload }, { call, put }) {
      const { orderType, detailId: id } = payload;
      let re = {};
      yield put({
        type: 'updateState',
        payload: {
          detailId: id,
          detailData: null,
        },
      });
      let showApplicationDetail = false;
      let showAppModuleDetail = false;
      let showReleaseDetail = false;
      let showDeployDetail = false;
      switch (orderType.name) {
        case APPLY_ORDER_TYPE.APPLICATION.name:
          showApplicationDetail = true;
          re = yield call(getApplicationDetail, { id });
          break;
        case APPLY_ORDER_TYPE.MODULE.name:
          showAppModuleDetail = true;
          re = yield call(getAppModuleDetail, { id });
          break;
        case APPLY_ORDER_TYPE.PUBLISH.name:
          showReleaseDetail = true;
          re = yield call(getReleaseDetail, { id });
          break;
        case APPLY_ORDER_TYPE.DEPLOY.name:
          showDeployDetail = true;
          re = yield call(getDeployDetail, { id });
          break;
        default:
      }
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            detailData: re.data,
            showApplicationDetail,
            showAppModuleDetail,
            showReleaseDetail,
            showDeployDetail,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *getTag({ payload, callback }, { call }) {
      const re = yield call(getTag, payload);
      message.destroy();
      if (re.success) {
        if (callback && callback instanceof Function) {
          callback(re.data);
        }
      } else {
        message.error(re.message);
      }
    },
  },
});
