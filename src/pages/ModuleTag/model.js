import { utils, message } from 'suid';
import { get } from 'lodash';
import { createTag, removeTag, getNewTag, gitlabAsync } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'moduleTag',

  state: {
    currentModule: null,
    showTagModal: false,
    tagData: null,
    onlyView: false,
    newTag: false,
    moduleFilter: {},
  },
  effects: {
    *gitlabAsync({ callback }, { call, select }) {
      const { currentModule } = yield select(sel => sel.moduleTag);
      const re = yield call(gitlabAsync, { moduleCode: get(currentModule, 'code') });
      if (re.success) {
        message.success('标签同步成功');
      } else {
        message.destroy();
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getNewTag(_, { call, put, select }) {
      const { currentModule } = yield select(sel => sel.moduleTag);
      const re = yield call(getNewTag, { moduleCode: get(currentModule, 'code') });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            tagData: re.data,
            newTag: true,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *createTag({ payload, callback }, { call, put }) {
      const re = yield call(createTag, payload);
      message.destroy();
      if (re.success) {
        message.success('标签创建成功');
        yield put({
          type: 'updateState',
          payload: {
            showTagModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *removeTag({ payload, callback }, { call }) {
      const re = yield call(removeTag, payload);
      message.destroy();
      if (re.success) {
        message.success('标签删除成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
