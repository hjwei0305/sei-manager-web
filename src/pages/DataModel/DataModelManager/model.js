/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-08-02 16:51:47
 */
import { message } from 'antd';
import { utils } from 'suid';
import {
  del,
  save,
  listAllTree,
  findByTreeNodeId,
  addAuditFields,
  saveTreeNode,
  delTreeNode,
  saveModelField,
  deleteModelFields,
} from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'dataModelManager',

  state: {
    list: [],
    rowData: null,
    modalVisible: false,
    fieldModalVisible: false,
    treeData: [],
    currNode: null,
    configModelData: null,
  },
  effects: {
    *queryTree({ payload }, { call, put }) {
      const result = yield call(listAllTree, payload);
      const { data, success, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: [].concat(data),
          },
        });
      } else {
        message.error(msg);
      }
      return result;
    },
    *updateCurrNode({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });

      return payload;
    },
    *queryListByTypeCode({ payload }, { call, put }) {
      const result = yield call(findByTreeNodeId, payload);
      const { data, success, message: msg } = result || {};
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
          },
        });
      } else {
        message.error(msg);
      }

      return result;
    },
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveTreeNode({ payload }, { call }) {
      const result = yield call(saveTreeNode, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *saveModelField({ payload }, { call }) {
      const result = yield call(saveModelField, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('保存成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *addAuditFields({ payload }, { call }) {
      const result = yield call(addAuditFields, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success('添加成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success('删除成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *delTreeNode({ payload }, { call }) {
      const result = yield call(delTreeNode, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success('删除成功');
      } else {
        message.error(msg);
      }

      return result;
    },
    *deleteModelFields({ payload }, { call }) {
      const result = yield call(deleteModelFields, payload);
      const { message: msg, success } = result || {};
      message.destroy();
      if (success) {
        message.success('删除成功');
      } else {
        message.error(msg);
      }

      return result;
    },
  },
});
