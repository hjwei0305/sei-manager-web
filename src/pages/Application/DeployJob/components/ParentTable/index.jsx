import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tooltip } from 'antd';
import { utils, ExtIcon, ExtTable } from 'suid';
import FormModal from './FormModal';
import styles from './index.less';

const { authAction } = utils;

@connect(({ deployJob, loading }) => ({ deployJob, loading }))
class CascadeTableMaster extends Component {
  state = {
    delRowId: null,
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'deployJob/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployJob/updatePageState',
      payload: {
        pVisible: true,
        isAddP: false,
        currPRowData: rowData,
      },
    });
    e.stopPropagation();
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployJob/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'deployJob/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, deployJob } = this.props;
    const { currPRowData } = deployJob;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'deployJob/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'deployJob/updatePageState',
                payload: {
                  currPRowData: null,
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

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployJob/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['deployJob/delPRow'] && delRowId === row.id) {
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

  getFormModalProps = () => {
    const { loading, deployJob } = this.props;
    const { pVisible, currPRowData, isAddP } = deployJob;

    return {
      onSave: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['deployJob/saveParent'],
    };
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getExtableProps = () => {
    const { dispatch } = this.props;
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
        title: '任务名称',
        dataIndex: 'name',
        width: 160,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>,
      },
      {
        title: '任务描述',
        dataIndex: 'description',
        width: 200,
        required: true,
        render: (text, record) => <Tooltip title={record.className}>{text}</Tooltip>,
      },
    ];

    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key="add" type="primary" onClick={this.add} ignore="true">
              新建
            </Button>,
          )}
          <Button onClick={this.reloadData}>刷新</Button>
        </>
      ),
    };
    return {
      bordered: false,
      remotePaging: true,
      searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'deployJob/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `http://127.0.0.1:7001/deploy/findAll`,
      },
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

export default CascadeTableMaster;
