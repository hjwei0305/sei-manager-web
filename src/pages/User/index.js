import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { Button, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import ExtAction from './ExtAction';
import AssignRole from './AssignRole';
import styles from './index.less';

const { USER_BTN_KEY, SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ userList, loading }) => ({ userList, loading }))
class UserList extends Component {
  static tableRef;

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  createdSave = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/createdSave',
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

  editSave = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/editSave',
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

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/updateState',
      payload: {
        showModal: false,
        rowData: null,
        currentAssignUser: null,
        showAssignedRoleModal: false,
      },
    });
  };

  handlerAction = (key, user) => {
    const { dispatch } = this.props;
    const payload = { currentAssignUser: user };
    const extData = {};
    switch (key) {
      case USER_BTN_KEY.ASSIGN_ROLE:
        extData.showAssignedRoleModal = true;
        break;
      default:
    }
    dispatch({
      type: 'userList/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  assignRoles = (keys, callback) => {
    const {
      userList: { currentAssignUser },
      dispatch,
    } = this.props;
    const data = { parentId: get(currentAssignUser, 'id', null), childIds: keys };
    dispatch({
      type: 'userList/assignRoles',
      payload: {
        ...data,
      },
      callback,
    });
  };

  removeAssignedRoles = (keys, callback) => {
    const {
      userList: { currentAssignUser },
      dispatch,
    } = this.props;
    const data = { parentId: get(currentAssignUser, 'id', null), childIds: keys };
    dispatch({
      type: 'userList/removeAssignedRoles',
      payload: {
        ...data,
      },
      callback,
    });
  };

  renderAccount = (t, row) => {
    return (
      <>
        {t}
        {row.admin ? (
          <Tag color="blue" style={{ marginLeft: 8 }}>
            管理员
          </Tag>
        ) : null}
        {row.status === false ? (
          <Tag color="red" style={{ marginLeft: 8 }}>
            已禁用
          </Tag>
        ) : null}
      </>
    );
  };

  render() {
    const { userList, loading } = this.props;
    const { showModal, rowData, showAssignedRoleModal, currentAssignUser } = userList;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            {authAction(
              <ExtIcon
                key={USER_BTN_KEY.EDIT}
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                ignore="true"
                antd
              />,
            )}
            <ExtAction userData={record} onAction={this.handlerAction} />
          </span>
        ),
      },
      {
        title: '账号',
        dataIndex: 'account',
        width: 220,
        required: true,
        render: this.renderAccount,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        width: 160,
        required: true,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 180,
        render: t => t || '-',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        width: 360,
        render: t => t || '-',
      },
    ];
    const formModalProps = {
      createdSave: this.createdSave,
      editSave: this.editSave,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      editSaving: loading.effects['userList/editSave'],
      createdSaving: loading.effects['userList/createdSave'],
    };
    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key={USER_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const assignRoleProps = {
      closeModal: this.closeFormModal,
      showModal: showAssignedRoleModal,
      currentUser: currentAssignUser,
      assignRoles: this.assignRoles,
      removeAssignedRoles: this.removeAssignedRoles,
      assignLoading: loading.effects['userList/assignRoles'],
      removeAssignedLoading: loading.effects['userList/removeAssignedRoles'],
    };
    const tableProps = {
      toolBar: toolBarProps,
      columns,
      showSearchTooltip: true,
      searchPlaceHolder: '昵称、账号、手机号、电子邮箱',
      searchProperties: ['nickname', 'account', 'phone', 'email'],
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/user/findByPage`,
      },
      onTableRef: ref => (this.tableRef = ref),
      sort: {
        field: { nickname: null, phone: null },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
        <FormModal {...formModalProps} />
        <AssignRole {...assignRoleProps} />
      </div>
    );
  }
}

export default UserList;
