import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Badge } from 'antd';
import { isEqual } from 'lodash';
import { ExtTable, utils, ExtIcon } from 'suid';
import moment from 'moment';
import { constants } from '@/utils';
import FormModal from './FormModal';
import DeployDrawer from './DeployDrawer';
import Logs from './Logs';
import styles from '../../index.less';

const { CI_SERVER_PATH } = constants;
const accessToken = '59b1ca687d160740156091a5cf853408634b72bd98db4942da1be1647fad0b8a';
const { authAction } = utils;

const deploymentStatusTexts = [
  {
    status: 'default',
    text: '暂未部署',
  },
  {
    status: 'warning',
    text: '部署排队中',
  },
  {
    status: 'processing',
    text: '正在部署',
  },
  {
    status: 'error',
    text: '部署失败',
  },
  {
    status: 'success',
    text: '部署成功',
  },
];

@connect(({ project, loading }) => ({ project, loading }))
class ChildTable extends Component {
  state = {
    delRowId: null,
    selectedRowKeys: [],
    drawerVisible: false,
    logDrawerVisible: false,
  };

  componentDidMount() {
    this.reloadRef = setInterval(() => {
      this.reloadData();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.reloadRef);
  }

  reloadData = () => {
    const { project } = this.props;
    const { currPRowData } = project;
    if (currPRowData && this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload,
    });
  };

  handleSave = rowData => {
    const { dispatch } = this.props;

    dispatch({
      type: 'project/save',
      payload: {
        ...rowData,
        accessToken,
      },
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
      type: 'project/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: null,
      },
    });
  };

  edit = (rowData, e) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    dispatch({
      type: 'project/updatePageState',
      payload: {
        cVisible: true,
        currCRowData: rowData,
      },
    }).then(() => {
      this.setState({
        drawerVisible: true,
      });
    });
  };

  handleDeploy = (rowData, e) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    dispatch({
      type: 'project/updatePageState',
      payload: {
        currCRowData: rowData,
      },
    }).then(() => {
      this.setState({
        drawerVisible: true,
      });
    });
  };

  handleLog = (rowData, e) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    dispatch({
      type: 'project/updatePageState',
      payload: {
        currCRowData: rowData,
      },
    }).then(() => {
      this.setState({
        logDrawerVisible: true,
      });
    });
  };

  del = record => {
    const { dispatch, project } = this.props;
    const { currCRowData } = project;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'project/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'project/updatePageState',
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
      type: 'project/saveChild',
      payload: { ...data, accessToken },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'project/updatePageState',
          payload: {
            cVisible: false,
          },
        });
        this.reloadData();
      }
    });
  };

  onDeploy = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/deploy',
      payload: data,
    }).then(() => {
      this.setState(
        {
          drawerVisible: false,
        },
        () => {
          this.reloadData();
        },
      );
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['project/delCRow'] && delRowId === row.id) {
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

  handleCloseDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/updatePageState',
      payload: {
        currCRowData: null,
      },
    }).then(() => {
      this.setState({
        drawerVisible: false,
      });
    });
  };

  handleCloseLogDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/updatePageState',
      payload: {
        currCRowData: null,
      },
    }).then(() => {
      this.setState({
        logDrawerVisible: false,
      });
    });
  };

  getExtableProps = () => {
    const { selectedRowKeys } = this.state;
    const { project } = this.props;
    const { currPRowData } = project;
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
                    onClick={e => this.handleDeploy(record, e)}
                    type="play-circle"
                    ignore="true"
                    tooltip={{ title: '发布' }}
                    antd
                  />,
                )}
                {authAction(
                  <ExtIcon
                    key="log"
                    className="log"
                    onClick={e => this.handleLog(record, e)}
                    type="file-text"
                    ignore="true"
                    tooltip={{ title: '日志' }}
                    antd
                  />,
                )}
              </div>
            </>
          );
        },
      },
      {
        title: '标签名称',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '关联标签',
        dataIndex: 'refTag',
        width: 120,
        required: true,
        render: refTag => refTag || '-',
      },
      {
        title: '发布状态',
        dataIndex: 'deploymentStatus',
        width: 120,
        render: deploymentStatus => {
          const { text, status } = deploymentStatusTexts[deploymentStatus];
          return <Badge status={status} text={text} />;
        },
        required: true,
      },
      {
        title: '发布时间',
        dataIndex: 'deploymentDate',
        width: 200,
        render: deploymentDate =>
          deploymentDate ? moment(deploymentDate).format('YYYY-MM-DD HH:mm:ss') : '-',
        required: true,
      },
      {
        title: '参考分支',
        dataIndex: 'refBranch',
        width: 120,
        required: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 200,
        render: createdAt => (createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'),
        required: true,
      },
      {
        title: '标签描述',
        dataIndex: 'description',
        width: 300,
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
        projectId: currPRowData && currPRowData.id,
        accessToken,
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
      remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'POST',
        url: `${CI_SERVER_PATH}/tag/findByProjectId`,
      },
    };
  };

  getJobItems = () => {
    const { project } = this.props;
    const { currPRowData } = project;
    return this.dispatchAction({
      type: 'project/findItemsByJobId',
      payload: {
        jobId: currPRowData.jobId,
      },
    });
  };

  getFormModalProps = () => {
    const { loading, project } = this.props;
    const { currPRowData, currCRowData, cVisible } = project;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['project/saveChild'],
    };
  };

  getDeployDrawerProps = () => {
    const { drawerVisible } = this.state;
    const { loading, project } = this.props;
    const { currPRowData, currCRowData } = project;
    return {
      data: {
        project: currPRowData,
        tag: currCRowData,
      },
      getJobItems: this.getJobItems,
      visible: drawerVisible,
      onClose: this.handleCloseDrawer,
      onDeploy: this.onDeploy,
      isSaving: loading.effects['project/deploy'],
    };
  };

  getLogsDrawerProps = () => {
    const { project } = this.props;
    const { currCRowData } = project;
    const { logDrawerVisible } = this.state;

    return {
      key: currCRowData && currCRowData.id,
      tag: currCRowData,
      visible: logDrawerVisible,
      onClose: this.handleCloseLogDrawer,
    };
  };

  render() {
    const { logDrawerVisible, drawerVisible } = this.state;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
        {drawerVisible ? <DeployDrawer {...this.getDeployDrawerProps()} /> : null}
        {logDrawerVisible ? <Logs {...this.getLogsDrawerProps()} /> : null}
      </div>
    );
  }
}

export default ChildTable;
