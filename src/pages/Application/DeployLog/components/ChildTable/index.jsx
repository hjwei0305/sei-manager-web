import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Badge } from 'antd';
import { isEqual, get } from 'lodash';
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

@connect(({ deployLog, loading }) => ({ deployLog, loading }))
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
    const { deployLog } = this.props;
    const { currPRowData } = deployLog;
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
      type: 'deployLog/save',
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
      type: 'deployLog/updatePageState',
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
      type: 'deployLog/updatePageState',
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
      type: 'deployLog/updatePageState',
      payload: {
        currCRowData: rowData,
      },
    }).then(() => {
      this.setState({
        drawerVisible: true,
      });
    });
  };

  handleManualDeploy = project => {
    this.dispatchAction({
      type: 'deployLog/manualDeploy',
      payload: { projectId: project.id },
    }).then(() => {
      this.reloadData();
    });
  };

  handleLog = (rowData, e) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    dispatch({
      type: 'deployLog/updatePageState',
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
    const { dispatch, deployLog } = this.props;
    const { currCRowData } = deployLog;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'deployLog/delCRow',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            if (currCRowData && currCRowData.id === record.id) {
              dispatch({
                type: 'deployLog/updatePageState',
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
      type: 'deployLog/saveChild',
      payload: { ...data, accessToken },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'deployLog/updatePageState',
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
      type: 'deployLog/deploy',
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
      type: 'deployLog/updatePageState',
      payload: {
        cVisible: false,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['deployLog/delCRow'] && delRowId === row.id) {
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
      type: 'deployLog/updatePageState',
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
      type: 'deployLog/updatePageState',
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
    const { deployLog, loading } = this.props;
    const { currPRowData } = deployLog;
    const jobItems = get(currPRowData, 'deployJob.deployJobItems', []);
    const deployDevConfig = jobItems.filter(it => it.deployEnv === 'dev');
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
                {/* {deployDevConfig.length ? authAction(
                  <ExtIcon
                    key="edit"
                    className="edit"
                    onClick={e => this.handleDeploy(record, e)}
                    type="play-circle"
                    ignore="true"
                    tooltip={{ title: '终止' }}
                    antd
                  />,
                ) : null } */}
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
      // {
      //   title: '标签名称',
      //   dataIndex: 'name',
      //   width: 120,
      //   required: true,
      // },
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
      // {
      //   title: '参考分支',
      //   dataIndex: 'refBranch',
      //   width: 120,
      //   required: true,
      // },
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
          {deployDevConfig.length
            ? authAction(
                <Button
                  loading={loading.effects['deployLog/manualDeploy']}
                  key="add"
                  type="primary"
                  onClick={() => this.handleManualDeploy(currPRowData)}
                  ignore="true"
                >
                  手动发布
                </Button>,
              )
            : null}
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
      // remotePaging: true,
      toolBar: toolBarProps,
      allowCancelSelect: true,
      store: {
        type: 'GET',
        url: `${CI_SERVER_PATH}/deployLog/findByProjectId`,
      },
    };
  };

  getJobItems = () => {
    const { deployLog } = this.props;
    const { currPRowData } = deployLog;
    return this.dispatchAction({
      type: 'deployLog/findItemsByJobId',
      payload: {
        jobId: currPRowData.jobId,
      },
    });
  };

  getFormModalProps = () => {
    const { loading, deployLog } = this.props;
    const { currPRowData, currCRowData, cVisible } = deployLog;
    return {
      onSave: this.save,
      pRowData: currPRowData,
      rowData: currCRowData,
      visible: cVisible,
      onCancel: this.closeFormModal,
      isSaving: loading.effects['deployLog/saveChild'],
    };
  };

  getDeployDrawerProps = () => {
    const { drawerVisible } = this.state;
    const { loading, deployLog } = this.props;
    const { currPRowData, currCRowData } = deployLog;
    return {
      data: {
        deployLog: currPRowData,
        tag: currCRowData,
      },
      getJobItems: this.getJobItems,
      visible: drawerVisible,
      onClose: this.handleCloseDrawer,
      onDeploy: this.onDeploy,
      isSaving: loading.effects['deployLog/deploy'],
    };
  };

  getLogsDrawerProps = () => {
    const { deployLog } = this.props;
    const { currCRowData, currPRowData } = deployLog;
    const { logDrawerVisible } = this.state;

    return {
      key: currCRowData && currCRowData.id,
      deployLog: currCRowData,
      getJobItems: this.getJobItems,
      project: currPRowData,
      visible: logDrawerVisible,
      onClose: this.handleCloseLogDrawer,
    };
  };

  render() {
    const { logDrawerVisible, drawerVisible } = this.state;
    const { deployLog } = this.props;
    const { currCRowData } = deployLog;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
        {drawerVisible ? <DeployDrawer {...this.getDeployDrawerProps()} /> : null}
        {logDrawerVisible && currCRowData ? <Logs {...this.getLogsDrawerProps()} /> : null}
      </div>
    );
  }
}

export default ChildTable;
