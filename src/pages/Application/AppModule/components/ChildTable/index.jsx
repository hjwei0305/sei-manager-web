import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tooltip } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from '../../index.less';

const { CI_SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ appModule, loading }) => ({ appModule, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  reloadData = () => {
    const { appModule } = this.props;
    const { currPRowData } = appModule;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleSave = rowData => {
    const { dispatch } = this.props;

    dispatch({
      type: 'appModule/save',
      payload: rowData,
    }).then(res => {
      if (res.success) {
        this.setState({
          selectedRowKeys: [],
        });
        this.reloadData();
      }
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, appModule } = this.props;
    const { currCRowData } = appModule;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'appModule/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'appModule/updatePageState',
                payload: {
                  currCRowData: null,
                },
              }).then(() => {
                this.setState({
                  delRowId: null,
                });
              });
            } else {
              this.setState({
                delRowId: null,
              });
            }
            this.reloadData();
          }
        });
      },
    );
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/saveChild',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'appModule/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['appModule/delCRow'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <ExtIcon
        onClick={e => e.stopPropagation()}
        tooltip={{ title: '删除' }}
        className="del"
        type="delete"
        antd
      />
    );
  };

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { appModule } = this.props;
    const { currPRowData } = appModule;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 90,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          return (
            <>
              <div className="action-box" onClick={e => e.stopPropagation()}>
                {authAction(
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.edit(record, e)}
                    type="edit"
                    ignore="true"
                    tooltip={{ title: '编辑' }}
                    antd
                  />,
                )}
                {record.frozen ? null : (
                  <Popconfirm
                    key="delete"
                    placement="topLeft"
                    title="确定要删除吗？"
                    onCancel={e => e.stopPropagation()}
                    onConfirm={e => {
                      this.del(record);
                      e.stopPropagation();
                    }}
                  >
                    {this.renderDelBtn(record)}
                  </Popconfirm>
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 200,
        required: true,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 80,
        required: true,
      },
      {
        title: 'git 地址',
        dataIndex: 'gitUrl',
        width: 400,
        required: true,
      },
      {
        title: '分组名',
        dataIndex: 'groupName',
        width: 80,
        required: true,
      },
      {
        title: '部署任务',
        dataIndex: 'deployJob.name',
        width: 150,
        required: true,
      },
    ];

    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key="add" type="primary" ghost onClick={this.add} ignore="true">
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </Fragment>
      ),
    };
    return {
      bordered: false,
      cascadeParams: {
        applicationId: currPRowData && currPRowData.id,
      },
      selectedRowKeys,
      searchProperties: ['code', 'name'],
      onSelectRow: selectedKeys => {
        let tempKeys = selectedKeys;
        if (isEqual(selectedKeys, selectedRowKeys)) {
          tempKeys = [];
        }
        this.setState({
          selectedRowKeys: tempKeys,
        });
      },
      columns,
      // remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'GET',
        url: `${CI_SERVER_PATH}/project/findProjectByAppId`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, appModule } = this.props;
    const { currPRowData, currCRowData, cVisible } = appModule;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['appModule/saveChild'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default ChildTable;
