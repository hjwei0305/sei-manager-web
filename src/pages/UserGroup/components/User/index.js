import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag } from 'antd';
import { ExtTable, ExtIcon, BannerTitle } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import ResetModal from './ResetModal';
import ExtAction from './ExtAction';
import styles from './index.less';

const { MOCKER_PATH, USER_ACTION } = constants;

@connect(({ authUser, loading }) => ({ authUser, loading }))
class AuthUser extends Component {
  static tableRef;

  static propTypes = {
    userGroup: PropTypes.object.isRequired,
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/updateState',
      payload: {
        showFormModal: true,
        currentUser: null,
      },
    });
  };

  edit = currentUser => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/updateState',
      payload: {
        showFormModal: true,
        currentUser,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
          this.reloadData();
        }
      },
    });
  };

  resetPassword = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/resetPassword',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
        }
      },
    });
  };

  closeFormModal = (currentOrgNode = null) => {
    const { dispatch } = this.props;
    const st = {
      showFormModal: false,
      showResetPasswordModal: false,
      showConfigFeatrueRole: false,
      currentUser: null,
    };
    if (currentOrgNode) {
      st.currentOrgNode = currentOrgNode;
    }
    dispatch({
      type: 'authUser/updateState',
      payload: {
        ...st,
      },
    });
  };

  handlerAction = (key, authUser) => {
    const { dispatch } = this.props;
    const payload = { currentUser: authUser };
    const extData = {};
    switch (key) {
      case USER_ACTION.RESET_PASSWORD:
        extData.showResetPasswordModal = true;
        break;
      case USER_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      default:
    }
    dispatch({
      type: 'authUser/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  render() {
    const { loading, authUser, userGroup } = this.props;
    const { showFormModal, showResetPasswordModal, currentUser, treeData } = authUser;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon className="edit" onClick={() => this.edit(record)} type="edit" antd />
            <ExtAction employeeData={record} onAction={this.handlerAction} />
          </span>
        ),
      },
      {
        title: '用户编号',
        dataIndex: 'code',
        width: 120,
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        width: 180,
        required: true,
        render: (text, record) => {
          if (record.frozen) {
            return (
              <>
                {text}
                <Tag color="red" style={{ marginLeft: 8 }}>
                  已冻结
                </Tag>
              </>
            );
          }
          return text;
        },
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      cascadeParams: { userGroupId: userGroup ? userGroup.id : null },
      onTableRef: ref => (this.tableRef = ref),
      remotePaging: true,
      searchPlaceHolder: '请输入用户编号或姓名关键字查询',
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${MOCKER_PATH}/sei-manager/user/getUserList`,
      },
    };
    const formModalProps = {
      save: this.save,
      userGroup,
      currentUser,
      showFormModal,
      orgData: treeData,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['authUser/save'],
    };
    const resetModalProps = {
      save: this.resetPassword,
      currentUser,
      showModal: showResetPasswordModal,
      closeModal: this.closeFormModal,
      saving: loading.effects['authUser/resetPassword'],
    };
    return (
      <div className={cls(styles['authUser-box'])}>
        <Card title={<BannerTitle title={userGroup.name} subTitle="用户列表" />} bordered={false}>
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
        <ResetModal {...resetModalProps} />
      </div>
    );
  }
}

export default AuthUser;
