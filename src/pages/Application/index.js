import React, { Component } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon, utils } from 'suid';
import { constants } from '@/utils';
import UserList from './UserList';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ application, loading }) => ({ application, loading }))
class Application extends Component {
  static tableRef;

  componentWillUnmount() {
    this.closeUserListModal();
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  showAdminUserSet = currentApp => {
    const { dispatch } = this.props;
    dispatch({
      type: 'application/updateState',
      payload: {
        currentApp,
        showModal: true,
      },
    });
  };

  assignAppAdminUser = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'application/assignAppAdminUser',
      payload: data,
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
  };

  closeUserListModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'application/updateState',
      payload: {
        currentApp: null,
        showModal: false,
      },
    });
  };

  render() {
    const { application, loading } = this.props;
    const { currentApp, showModal } = application;
    const columns = [
      {
        title: '应用代码',
        dataIndex: 'code',
        width: 180,
        required: true,
      },
      {
        title: '应用名称',
        dataIndex: 'name',
        width: 260,
        required: true,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 80,
        required: true,
        render: t => t || '-',
      },
      {
        title: '管理员',
        dataIndex: 'managerAccount',
        width: 180,
        required: true,
        render: (t, row) => (t ? `${row.managerAccountName}(${t})` : '-'),
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 380,
        required: true,
        render: t => t || '-',
      },
      {
        title: '项目组名称',
        dataIndex: 'groupCode',
        width: 200,
        render: t => t || '-',
      },
      {
        title: '项目组描述',
        dataIndex: 'groupName',
        width: 280,
        render: t => t || '-',
      },
    ];
    const action = {
      title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
      key: 'operation',
      width: 80,
      align: 'center',
      dataIndex: 'id',
      className: 'action',
      required: true,
      render: (text, record) => (
        <span className={cls('action-box')}>
          <ExtIcon
            onClick={() => this.showAdminUserSet(record)}
            type="team"
            antd
            tooltip={{ title: '设置管理员' }}
          />
        </span>
      ),
    };
    if (authAction(<span authCode="SZGLY" />)) {
      columns.unshift(action);
    }
    const toolBarProps = {
      left: (
        <>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      lineNumber: false,
      onTableRef: ref => (this.tableRef = ref),
      showSearchTooltip: true,
      searchPlaceHolder: '应用代码、应用名称、描述说明、所属组代码、所属组名称',
      searchProperties: ['code', 'name', 'remark', 'groupCode', 'groupName'],
      searchWidth: 260,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPage`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      sort: {
        multiple: true,
        field: {
          name: 'asc',
          version: 'asc',
          code: null,
          remark: null,
          groupCode: null,
          groupName: null,
        },
      },
    };
    const userListProps = {
      currentApp,
      showModal,
      assignUser: this.assignAppAdminUser,
      assignLoading: loading.effects['application/assignAppAdminUser'],
      closeModal: this.closeUserListModal,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
        <UserList {...userListProps} />
      </div>
    );
  }
}

export default Application;
