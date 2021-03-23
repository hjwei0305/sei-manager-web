import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Popconfirm, Popover, Tag } from 'antd';
import { ExtTable, BannerTitle, ExtIcon, ListCard, AuthAction } from 'suid';
import { FilterView } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH, REQUEST_TYPE } = constants;

@connect(({ appGateway, loading }) => ({ appGateway, loading }))
class ApiList extends Component {
  static tableRef;

  static syncEvnData;

  constructor(props) {
    super(props);
    this.syncEvnData = [];
    this.state = {
      delRowId: null,
      showEvnSync: false,
    };
  }

  componentWillUnmount() {
    this.syncEvnData = [];
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
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
          type: 'appGateway/del',
          payload: {
            id: record.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRowId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  handlerEvnSync = showEvnSync => {
    this.setState({ showEvnSync });
  };

  handlerEnvChange = selectedEnv => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/updateState',
      payload: {
        selectedEnv,
      },
    });
  };

  handlerSync = () => {
    const {
      dispatch,
      appGateway: { selectedEnv, selectedApp },
    } = this.props;
    const data = {
      appCode: get(selectedApp, 'code'),
      envCode: get(selectedEnv, 'code'),
      targetEnvList: this.syncEvnData.map(e => e.code),
    };
    dispatch({
      type: 'appGateway/syncConfigs',
      payload: data,
      callback: res => {
        if (res.success) {
          this.setState({ showEvnSync: false });
          this.reloadData();
        }
      },
    });
  };

  release = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appGateway/releaseConfigs',
    });
  };

  renderEvnVarList = () => {
    const {
      loading,
      appGateway: { envData, selectedEnv },
    } = this.props;
    const dataSource = envData.filter(env => env.code !== selectedEnv.code);
    const listProps = {
      searchProperties: ['code', 'remark'],
      showArrow: false,
      checkbox: true,
      pagination: false,
      showSearch: false,
      customTool: () => null,
      dataSource,
      itemField: {
        title: item => item.code,
        description: item => item.name,
      },
      onSelectChange: (_keys, items) => {
        this.syncEvnData = items;
        this.forceUpdate();
      },
    };
    const syncLoading = loading.effects['appGateway/syncConfigs'];
    return (
      <>
        <div className="tool-box">
          <AuthAction>
            <Popconfirm
              authCode="SYNC"
              disabled={syncLoading || this.syncEvnData.length === 0}
              title="确定要同步吗?"
              onConfirm={() => this.handlerSync()}
            >
              <Button loading={syncLoading} disabled={this.syncEvnData.length === 0} type="primary">
                开始同步
              </Button>
            </Popconfirm>
          </AuthAction>
        </div>
        <div className="env-box">
          <ListCard {...listProps} />
        </div>
      </>
    );
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['appGateway/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <AuthAction>
        <Popconfirm
          authCode="CUD"
          placement="topLeft"
          title={formatMessage({
            id: 'global.delete.confirm',
            defaultMessage: '确定要删除吗？提示：删除后不可恢复',
          })}
          onConfirm={() => this.del(row)}
        >
          <ExtIcon className="del" type="delete" antd />
        </Popconfirm>
      </AuthAction>
    );
  };

  renderRequestMethod = text => {
    if (text) {
      const rq = REQUEST_TYPE[text];
      if (rq) {
        return <Tag color={rq.color}>{rq.key}</Tag>;
      }
    }
    return '-';
  };

  render() {
    const { showEvnSync } = this.state;
    const { appGateway, loading } = this.props;
    const { selectedApp, showModal, rowData, envData, selectedEnv } = appGateway;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <AuthAction>
              <ExtIcon
                authCode="CUD"
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                ignore="true"
                antd
              />
            </AuthAction>
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        width: 90,
        render: this.renderRequestMethod,
      },
      {
        title: '接口地址',
        dataIndex: 'uri',
        width: 380,
        render: t => t || '-',
      },
      {
        title: '接口描述',
        dataIndex: 'remark',
        width: 260,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <FilterView
            style={{ marginRight: 16 }}
            currentViewType={selectedEnv}
            viewTypeData={envData}
            onAction={this.handlerEnvChange}
            reader={{
              title: 'name',
              value: 'code',
            }}
          />
          <AuthAction>
            <Button authCode="CUD" type="primary" onClick={this.add}>
              新建
            </Button>
          </AuthAction>
          <AuthAction>
            <Button
              authCode="RELEASE"
              type="primary"
              loading={loading.effects['appGateway/releaseConfigs']}
              ghost
              onClick={this.release}
            >
              发布
            </Button>
          </AuthAction>
          <Popover
            overlayClassName={styles['sync-popover-box']}
            onVisibleChange={this.handlerEvnSync}
            visible={showEvnSync}
            destroyTooltipOnHide
            trigger="click"
            placement="rightTop"
            content={this.renderEvnVarList()}
            title="同步到环境"
          >
            <Button>同步到环境</Button>
          </Popover>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '接口地址、接口描述关键字',
      searchProperties: ['uri', 'remark'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/authWhitelist/findByAppEnv`,
      },
      lineNumber: false,
      cascadeParams: {
        appCode: get(selectedApp, 'code'),
        envCode: get(selectedEnv, 'code'),
      },
    };
    const formModalProps = {
      showModal,
      rowData,
      selectedApp,
      selectedEnv,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['appGateway/save'],
      save: this.save,
    };
    return (
      <div className={cls(styles['app-list-box'])}>
        <Card
          title={<BannerTitle title={get(selectedApp, 'name')} subTitle="网关白名单" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default ApiList;
