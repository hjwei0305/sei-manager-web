import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, message } from 'antd';
import TreeView from '@/components/TreeView';
import FormModal from './FormModal';

@connect(({ dataModelManager, loading }) => ({ dataModelManager, loading }))
class TreePanel extends Component {
  state = {
    parentData: null,
    editData: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/queryTree',
    });
  }

  handleSelect = selectNodes => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'dataModelManager/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        },
      }).then(({ currNode }) => {
        dispatch({
          type: 'dataModelManager/queryListByTypeCode',
          payload: {
            typeCode: currNode.code,
          },
        });
      });
    }
  };

  handleCreateRootNode = () => {
    const { dispatch } = this.props;
    this.setState(
      {
        editData: null,
        parentData: null,
      },
      () => {
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleCreateChildNode = parentData => {
    const { dispatch } = this.props;
    this.setState(
      {
        parentData,
        editData: null,
      },
      () => {
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleEditTreeNode = editData => {
    const { dispatch } = this.props;
    this.setState(
      {
        editData,
        parentData: null,
      },
      () => {
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            showCreateModal: true,
          },
        });
      },
    );
  };

  handleDel = delNode => {
    const { dataModelManager, dispatch } = this.props;
    const { currNode } = dataModelManager;
    if (delNode) {
      dispatch({
        type: 'dataModelManager/delTreeNode',
        payload: {
          id: delNode.id,
        },
      }).then(res => {
        if (res.success && currNode && currNode.id === delNode.id) {
          dispatch({
            type: 'dataModelManager/updateState',
            payload: {
              currNode: null,
            },
          });
        }
        this.reloadData();
      });
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/updateState',
      payload: {
        showCreateModal: false,
      },
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/queryTree',
    });
  };

  getToolBarProps = () => ({
    left: (
      <Fragment>
        <Button onClick={this.handleCreateRootNode} type="primary">
          创建根结点
        </Button>
      </Fragment>
    ),
  });

  getModalProps = () => {
    const { parentData, editData } = this.state;
    const { dataModelManager, loading } = this.props;
    const { showCreateModal } = dataModelManager;

    return {
      parentData,
      editData,
      saving: loading.effects['dataModelManager/saveTreeNode'],
      visible: showCreateModal,
      onCancel: this.handleCancel,
    };
  };

  render() {
    const { dataModelManager } = this.props;
    const { showCreateModal, treeData } = dataModelManager;

    return (
      <div style={{ height: '100%' }}>
        <TreeView
          toolBar={this.getToolBarProps()}
          treeData={treeData}
          onSelect={this.handleSelect}
          iconOpts={[
            {
              icon: 'plus',
              title: '新增子节点',
              onClick: this.handleCreateChildNode,
            },
            {
              icon: 'edit',
              title: '编辑',
              onClick: this.handleEditTreeNode,
            },
            {
              icon: 'delete',
              title: '删除',
              onClick: this.handleDel,
              isDel: true,
            },
          ]}
        />
        {showCreateModal ? <FormModal {...this.getModalProps()} /> : null}
      </div>
    );
  }
}

export default TreePanel;
