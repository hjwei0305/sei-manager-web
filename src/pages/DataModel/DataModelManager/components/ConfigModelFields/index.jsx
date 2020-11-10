import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, message, Tag, Descriptions } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';

import FormModal from './FormModal';
import styles from '../../index.less';

const { MANAGER_CONTEXT } = constants;

@connect(({ dataModelManager, loading }) => ({ dataModelManager, loading }))
class ConfigModelFields extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch, dataModelManager } = this.props;
    if (dataModelManager.currNode) {
      dispatch({
        type: 'dataModelManager/updateState',
        payload: {
          fieldModalVisible: true,
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
        rowData,
        fieldModalVisible: true,
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
        fieldModalVisible: true,
      },
    });
  };

  handleAddAuditFields = () => {
    const { dispatch, dataModel } = this.props;
    dispatch({
      type: 'dataModelManager/addAuditFields',
      payload: {
        modelId: dataModel.id,
      },
    }).then(res => {
      if (res.success) {
        this.reloadData();
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataModelManager/saveModelField',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'dataModelManager/updateState',
          payload: {
            fieldModalVisible: false,
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
          type: 'dataModelManager/deleteModelFields',
          payload: [record.id],
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
        fieldModalVisible: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataModelManager/deleteModelFields'] && delRowId === row.id) {
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
    // const { currRowData, } = this.state;
    const { dataModel } = this.props;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 150,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')}>
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
        title: '字段名称',
        dataIndex: 'fieldName',
        width: 180,
        required: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 220,
        required: true,
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        width: 120,
        required: true,
      },
      {
        title: '数据类型描述',
        dataIndex: 'dataTypeDesc',
        width: 120,
        required: true,
      },
      {
        title: '长度',
        dataIndex: 'dataLength',
        width: 120,
        required: true,
      },
      {
        title: '精度',
        dataIndex: 'precision',
        width: 120,
        required: true,
      },
      {
        title: '不允许为空',
        dataIndex: 'notNull',
        width: 120,
        required: true,
        render: notNull => (
          <Tag color={notNull ? 'red' : 'green'}>{notNull ? '禁止为空' : '可为空'}</Tag>
        ),
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        width: 120,
        required: true,
      },
      {
        title: '主键',
        dataIndex: 'primaryKey',
        width: 80,
        required: true,
        render: isPrimaryKey => (
          <Tag color={!isPrimaryKey ? 'red' : 'green'}>{!isPrimaryKey ? '否' : '是'}</Tag>
        ),
      },
      {
        title: '发布状态',
        dataIndex: 'published',
        width: 120,
        required: true,
        render: published => (
          <Tag color={!published ? 'red' : 'green'}>{!published ? '修改未发布' : '已经发布'}</Tag>
        ),
      },
      {
        title: '排序',
        dataIndex: 'rank',
        width: 120,
        required: true,
      },
    ];

    const toolBarProps = {
      left: (
        <Fragment>
          <Button key="add" type="primary" onClick={this.add} ignore="true">
            新建
          </Button>
          <Button onClick={this.handleAddAuditFields}>添加审计字段</Button>
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'GET',
        url: `${MANAGER_CONTEXT}/dataModel/getDataModelFields?modelId=${dataModel.id}`,
      },
      searchProperties: ['fieldName'],
      searchPlaceHolder: '输入字段名进行搜索',
    };
  };

  getFormModalProps = () => {
    const { loading, dataModelManager, dataModel } = this.props;
    const { fieldModalVisible, rowData } = dataModelManager;

    return {
      onSave: this.save,
      editData: rowData,
      visible: fieldModalVisible,
      parentData: dataModel,
      onClose: this.handleCloseModal,
      saving: loading.effects['dataModelManager/saveModelField'],
    };
  };

  getDescriptionTitle = () => {
    const { goBack, dataModel } = this.props;

    return (
      <>
        <span className={cls('back-icon')} onClick={goBack}>
          <ExtIcon type="left" onClick={goBack} antd />
        </span>
        {`配置模型【${dataModel.tableName}】的字段`}
      </>
    );
  };

  render() {
    const { dataModelManager, dataModel } = this.props;
    const { fieldModalVisible } = dataModelManager;

    return (
      <div className={cls(styles['container-box'])}>
        <div className={cls('description-items')}>
          <Descriptions title={this.getDescriptionTitle()}>
            <Descriptions.Item label="表名">{dataModel.tableName}</Descriptions.Item>
            <Descriptions.Item label="描述">{dataModel.remark}</Descriptions.Item>
            <Descriptions.Item label="数据源">{dataModel.dsName}</Descriptions.Item>
            <Descriptions.Item label="模型分类代码">{dataModel.modelTypeCode}</Descriptions.Item>
            <Descriptions.Item label="模型分类名称">{dataModel.modelTypeName}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className={cls('opt-table')}>
          <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        </div>
        {fieldModalVisible ? <FormModal {...this.getFormModalProps()} /> : null}
      </div>
    );
  }
}

export default ConfigModelFields;
