import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import {
  delDeployTemplate,
  saveDeployTemplate,
  assignStages,
  removeAssignedStages,
  saveTemplateStage,
  getStageParameters,
  getTemplateXml,
} from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'deployTemplate',

  state: {
    currentTemplate: null,
    selectedTemplate: null,
    showAssign: false,
    currentTemplateState: null,
    showEditStateModal: false,
    stageParams: [],
    templateXml: '',
  },
  effects: {
    *getTemplateXml({ payload }, { call, put }) {
      const res = yield call(getTemplateXml, payload);
      let templateXml = '';
      if (res.success) {
        templateXml = res.data;
      }
      yield put({
        type: 'updateState',
        payload: {
          templateXml,
        },
      });
    },
    *getStageParameters({ payload }, { call, put }) {
      const res = yield call(getStageParameters, payload);
      let stageParams = [];
      if (res.success) {
        stageParams = res.data;
      }
      yield put({
        type: 'updateState',
        payload: {
          stageParams,
        },
      });
    },
    *saveDeployTemplate({ payload, callback }, { call, put }) {
      const re = yield call(saveDeployTemplate, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            selectedTemplate: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delDeployTemplate({ payload, callback }, { call, put }) {
      const re = yield call(delDeployTemplate, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentTemplate: null,
            selectedTemplate: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignStages({ payload, callback }, { call, put }) {
      const re = yield call(assignStages, payload);
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
    *removeAssignedStages({ payload, callback }, { call }) {
      const re = yield call(removeAssignedStages, payload);
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
    *saveTemplateStage({ payload, callback }, { call, put }) {
      const re = yield call(saveTemplateStage, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentTemplateState: null,
            showEditStateModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
