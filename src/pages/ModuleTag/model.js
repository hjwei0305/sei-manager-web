import { utils, message } from 'suid';
import { get } from 'lodash';
import { createTag, removeTag, getNewTag, gitlabAsync, getTag } from './service';

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
    hideSider: false,
    filter: {},
  },
  effects: {
    *gitlabAsync({ callback }, { call, select }) {
      const { currentModule } = yield select(sel => sel.moduleTag);
      const re = yield call(gitlabAsync, { moduleId: get(currentModule, 'id') });
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
      const re = yield call(getNewTag, { moduleId: get(currentModule, 'id') });
      if (re.success) {
        const tagData = { ...re.data };
        const { major, minor, revised: originRevised } = tagData;
        const revised = originRevised + 1;
        Object.assign(tagData, { revised, tagName: `${major}.${minor}.${revised}` });
        yield put({
          type: 'updateState',
          payload: {
            tagData,
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
