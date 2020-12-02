import { utils, message } from 'suid';
import { createTag, removeTag } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'moduleTag',

  state: {
    currentModule: null,
    showTagModal: false,
    tagData: null,
    moduleFilter: {},
  },
  effects: {
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
