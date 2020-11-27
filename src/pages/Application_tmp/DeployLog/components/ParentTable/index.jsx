import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tooltip } from 'antd';
import { utils, ExtIcon, ListCard, ComboList } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { CI_SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ deployLog, loading }) => ({ deployLog, loading }))
class CascadeTableMaster extends Component {
  state = {
    delRowId: null,
    application: null,
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'deployLog/updatePageState',
      payload: {
        pVisible: true,
        isAddP: true,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployLog/updatePageState',
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
      type: 'deployLog/saveParent',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'deployLog/updatePageState',
          payload: {
            pVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch, deployLog } = this.props;
    const { currPRowData } = deployLog;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'deployLog/delPRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currPRowData && currPRowData.id === record.id) {
              dispatch({
                type: 'deployLog/updatePageState',
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
      type: 'deployLog/updatePageState',
      payload: {
        pVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['deployLog/delPRow'] && delRowId === row.id) {
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

  getComboListProps = () => {
    const { application } = this.state;
    return {
      showSearch: false,
      store: {
        type: 'GET',
        autoLoad: true,
        url: `${CI_SERVER_PATH}/appModule/findAll`,
      },
      reader: {
        name: item => `${item.name}(${item.code})`,
      },
      value: application ? `${get(application, 'name', '')}(${get(application, 'code', '')})` : '',
      style: { width: '60%' },
      width: 200,
      placeholder: '请选择应用',
      afterSelect: app => {
        this.setState({
          application: app,
        });
      },
      afterLoaded: data => {
        if (data && data.length) {
          const [app] = data;
          this.setState({
            application: app,
          });
        }
      },
    };
  };

  getCustomTool = ({ total }) => {
    return (
      <>
        <ComboList {...this.getComboListProps()} />
        <div>
          <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
        </div>
      </>
    );
  };

  getFormModalProps = () => {
    const { loading, deployLog } = this.props;
    const { pVisible, currPRowData, isAddP } = deployLog;

    return {
      onSave: this.save,
      rowData: isAddP ? null : currPRowData,
      visible: pVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['deployLog/saveParent'],
    };
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  getListCardProps = () => {
    const { application } = this.state;
    const applicationId = get(application, 'id');

    return {
      // title: '远程数据获取演示',
      cascadeParams: {
        applicationId,
      },
      onSelectChange: (_, items) => {
        this.dispatchAction({
          type: 'deployLog/updatePageState',
          payload: {
            currPRowData: items[0],
          },
        });
      },
      showSearch: false,
      store: applicationId
        ? {
            type: 'GET',
            url: `${CI_SERVER_PATH}/project/findProjectByAppId`,
          }
        : null,
      searchProperties: ['name', 'description'],
      itemField: {
        title: item => item.name,
        description: item => item.description,
        extra: item => (
          <span style={{ fontSize: 12, marginRight: 8 }}>
            {get(item, 'deployJob.name', '暂未配置部署任务')}
          </span>
        ),
      },
      customTool: this.getCustomTool,
    };
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
      // remotePaging: true,
      searchProperties: ['code', 'name'],
      columns,
      toolBar: toolBarProps,
      onSelectRow: (_, selectedRows) => {
        dispatch({
          type: 'deployLog/updatePageState',
          payload: {
            currPRowData: selectedRows[0],
          },
        });
      },
      store: {
        type: 'POST',
        url: `${CI_SERVER_PATH}/deployLog/findAll`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        {/* <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} /> */}
        <ListCard onListCardRef={inst => (this.listCardRef = inst)} {...this.getListCardProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default CascadeTableMaster;
