import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, message } from 'antd';
import { ExtTable, ExtIcon } from 'suid';

import FormModal from './FormModal';
import styles from '../../index.less';

@connect(({ dataModelManager, loading }) => ({ dataModelManager, loading }))
class TablePanel extends Component {
  state = {
    delRowId: null,
    // currRowData: null,
  };

  nestedTableRefs = {};

  reloadData = () => {
    const { dispatch, dataModelManager } = this.props;
    const { currNode } = dataModelManager;

    if (currNode) {
      dispatch({
        type: 'dataModelManager/queryListByTypeCode',
        payload: {
          typeCode: currNode.code,
        },
      });
      Object.keys(this.nestedTableRefs).forEach(key => {
        if (this.nestedTableRefs[key]) {
          this.nestedTableRefs[key].remoteDataRefresh();
        }
      });
    }
  };

  add = () => {
    const { dispatch, dataModelManager } = this.props;
    if (dataModelManager.currNode) {
      dispatch({
        type: 'dataModelManager/updateState',
        payload: {
          modalVisible: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择左侧树形节点');
    }
  };

  editFields = (rowData, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/updateState',
      payload: {
        configModelData: rowData,
      },
    });
  };

  edit = (rowData, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/updateState',
      payload: {
        rowData,
        modalVisible: true,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'dataModelManager/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/updateState',
      payload: {
        modalVisible: false,
        rowData: null,
      },
    });
  };

  // handleSelectedRow = (_, rowData) => {
  //   if (rowData) {
  //     this.setState({
  //       currRowData: rowData[0]
  //     });
  //   }
  // }

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataModelManager/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        tooltip={{
          title: '编辑',
        }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getExtableProps = () => {
    const { loading, dataModelManager } = this.props;
    const { list } = dataModelManager;

    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 150,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              key="setting"
              className="setting"
              onClick={e => this.editFields(record, e)}
              type="setting"
              tooltip={{
                title: '配置模型字段',
              }}
              ignore="true"
              antd
            />
            <ExtIcon
              key="edit"
              className="edit"
              onClick={e => this.edit(record, e)}
              type="edit"
              tooltip={{
                title: '编辑',
              }}
              ignore="true"
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗, 删除后不可恢复？"
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '表名',
        dataIndex: 'tableName',
        width: 120,
        required: true,
      },
      {
        title: '数据源',
        dataIndex: 'dsName',
        width: 120,
        required: true,
      },
      {
        title: '模型分类代码',
        dataIndex: 'modelTypeCode',
        width: 120,
        required: true,
      },
      {
        title: '模型分类名称',
        dataIndex: 'modelTypeName',
        width: 120,
        required: true,
      },
      {
        title: '描述',
        dataIndex: 'remark',
        width: 160,
        required: true,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 160,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          <Button key="add" type="primary" onClick={this.add} ignore="true">
            新建
          </Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      allowCancelSelect: true,
      columns,
      loading: loading.effects['dataModelManager/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
      searchProperties: ['tableName'],
      searchPlaceHolder: '输入表名进行搜索',
    };
  };

  getFormModalProps = () => {
    const { loading, dataModelManager } = this.props;
    const { modalVisible, rowData, currNode } = dataModelManager;

    return {
      onSave: this.save,
      editData: rowData,
      visible: modalVisible,
      parentData: currNode,
      onClose: this.handleCloseModal,
      saving: loading.effects['dataModelManager/save'],
    };
  };

  render() {
    const { dataModelManager } = this.props;
    const { modalVisible } = dataModelManager;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...this.getExtableProps()} />
        {modalVisible ? <FormModal {...this.getFormModalProps()} /> : null}
      </div>
    );
  }
}

export default TablePanel;
