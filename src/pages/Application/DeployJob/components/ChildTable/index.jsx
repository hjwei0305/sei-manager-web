import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, utils, ExtIcon } from 'suid';
import FormModal from './FormModal';
import styles from '../../index.less';

const { authAction } = utils;

@connect(({ deployJob, loading }) => ({ deployJob, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({ type, payload });
  };

  reloadData = () => {
    const { deployJob } = this.props;
    const { currPRowData } = deployJob;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleSave = rowData => {
    const { dispatch } = this.props;

    dispatch({
      type: 'deployJob/save',
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
      type: 'deployJob/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployJob/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  del = record => {
    const { dispatch, deployJob } = this.props;
    const { currCRowData } = deployJob;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'deployJob/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'deployJob/updatePageState',
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
      type: 'deployJob/saveChild',
      payload: data,
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'deployJob/updatePageState',
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
      type: 'deployJob/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  handleCreateJenkinsJob = record => {
    this.dispatchAction({
      type: 'deployJob/creatJenkinsJob',
      payload: {
        jobName: record.name,
        xml: record.deployScript,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['deployJob/delCRow'] && delRowId === row.id) {
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
    const { deployJob, loading } = this.props;
    const { currPRowData } = deployJob;
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 145,
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
                    key="file-sync"
                    className="file-sync"
                    loading={loading.effects['deploy/creatJenkinsJob']}
                    onClick={() => this.handleCreateJenkinsJob(record)}
                    type="file-sync"
                    ignore="true"
                    tooltip={{ title: '同步jenkins任务' }}
                    antd
                  />,
                )}
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
        title: '任务项名称',
        dataIndex: 'name',
        width: 180,
        required: true,
      },
      {
        title: '部署环境',
        dataIndex: 'deployEnv',
        width: 120,
        required: true,
      },
      {
        title: '部署脚本',
        dataIndex: 'deployScript',
        width: 300,
        ellipsis: true,
        required: true,
      },
      {
        title: '任务项描述',
        dataIndex: 'description',
        width: 120,
        required: true,
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        width: 120,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
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
        jobId: currPRowData && currPRowData.id,
      },
      selectedRowKeys,
      // searchProperties: ['code', 'name'],
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
        type: 'POST',
        url: `http://127.0.0.1:7001/deploy/findItemsByJobId`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, deployJob } = this.props;
    const { currPRowData, currCRowData, cVisible } = deployJob;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      saving: loading.effects['deployJob/saveChild'],
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
