import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { trim } from 'lodash';
import { Button, Modal, Input } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, BannerTitle, message } from 'suid';
import { constants } from '../../../utils';
import ApplyState from '../components/ApplyState';
import ExtAction from './ExtAction';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH, APPLY_APPLICATION_ACTION } = constants;
const { TextArea } = Input;

@connect(({ applyApplication, loading }) => ({ applyApplication, loading }))
class Certificate extends PureComponent {
  static tableRef;

  static messageText;

  static confirmModal;

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyApplication/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    let action = 'createSave';
    if (data.id) {
      action = 'editSave';
    }
    dispatch({
      type: `applyApplication/${action}`,
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

  saveToApprove = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyApplication/saveToApprove',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'applyApplication/updateState',
            payload: {
              showModal: false,
            },
          });
          this.reloadData();
        }
      },
    });
  };

  approve = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyApplication/approve',
      payload: {
        ...rowData,
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
      type: 'applyApplication/updateState',
      payload: {
        onlyView: false,
        showModal: false,
        rowData: null,
      },
    });
  };

  handlerAction = (key, rowData) => {
    const { dispatch } = this.props;
    switch (key) {
      case APPLY_APPLICATION_ACTION.VIEW:
        dispatch({
          type: 'payBillApply/updateState',
          payload: {
            rowData,
            onlyView: true,
            showModal: true,
          },
        });
        break;
      case APPLY_APPLICATION_ACTION.EDIT:
        dispatch({
          type: 'applyApplication/updateState',
          payload: {
            showModal: true,
            rowData,
          },
        });
        break;
      case APPLY_APPLICATION_ACTION.DELETE:
        this.delConfirm(rowData);
        break;
      case APPLY_APPLICATION_ACTION.APPROVE:
        this.approve(rowData);
        break;
      case APPLY_APPLICATION_ACTION.STOP_APPROVE:
        this.stopApprove(rowData);
        break;
      default:
    }
  };

  handlerMessageText = e => {
    this.messageText = trim(e.target.value);
  };

  stopApprove = rowData => {
    const { dispatch } = this.props;
    this.confirmModal = Modal.confirm({
      title: <BannerTitle title="终止审核原因" subTitle="确认" />,
      content: <TextArea style={{ resize: 'none' }} rows={3} onChange={this.handlerMessageText} />,
      okButtonProps: { type: 'primary' },
      style: { top: '20%' },
      okText: '确定',
      onOk: () => {
        return new Promise(resolve => {
          if (this.messageText) {
            this.confirmModal.update({
              okButtonProps: { type: 'primary', loading: true },
              cancelButtonProps: { disabled: true },
            });
            dispatch({
              type: 'applyApplication/stopApprove',
              payload: {
                id: rowData.id,
                messageText: this.messageText,
              },
              callback: res => {
                if (res.success) {
                  resolve();
                  this.reloadData();
                } else {
                  this.confirmModal.update({
                    okButtonProps: { loading: false },
                    cancelButtonProps: { disabled: false },
                  });
                }
              },
            });
          } else {
            message.destroy();
            message.error('请输入终止审核原因');
            this.confirmModal.update({
              okButtonProps: { loading: false },
              cancelButtonProps: { disabled: false },
            });
          }
        });
      },
      cancelText: '取消',
      onCancel: () => {
        this.confirmModal.destroy();
        this.confirmModal = null;
      },
    });
  };

  delConfirm = rowData => {
    const { dispatch } = this.props;
    this.confirmModal = Modal.confirm({
      title: `删除确认`,
      content: `提示：申请删除后不可恢复!`,
      okButtonProps: { type: 'primary' },
      style: { top: '20%' },
      okText: '确定',
      onOk: () => {
        return new Promise(resolve => {
          this.confirmModal.update({
            okButtonProps: { type: 'primary', loading: true },
            cancelButtonProps: { disabled: true },
          });
          dispatch({
            type: 'applyApplication/del',
            payload: {
              id: rowData.id,
            },
            callback: res => {
              if (res.success) {
                resolve();
                this.reloadData();
              } else {
                this.confirmModal.update({
                  okButtonProps: { loading: false },
                  cancelButtonProps: { disabled: false },
                });
              }
            },
          });
        });
      },
      cancelText: '取消',
      onCancel: () => {
        this.confirmModal.destroy();
        this.confirmModal = null;
      },
    });
  };

  render() {
    const { applyApplication, loading } = this.props;
    const { showModal, rowData } = applyApplication;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 60,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        fixed: 'left',
        render: (id, record) => (
          <span className={cls('action-box')}>
            <ExtAction key={id} onAction={this.handlerAction} recordItem={record} />
          </span>
        ),
      },
      {
        title: '状态',
        dataIndex: 'approvalStatus',
        width: 100,
        required: true,
        render: t => <ApplyState state={t} />,
      },
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
        title: '应用版本',
        dataIndex: 'version',
        width: 120,
        required: true,
        render: t => t || '-',
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 380,
        required: true,
        render: t => t || '-',
      },
      {
        title: '所属组代码',
        dataIndex: 'groupCode',
        width: 200,
        render: t => t || '-',
      },
      {
        title: '所属组名称',
        dataIndex: 'groupName',
        width: 280,
        render: t => t || '-',
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving:
        loading.effects['applyApplication/createSave'] ||
        loading.effects['applyApplication/editSave'],
      saveToApprove: this.saveToApprove,
      saveToApproving: loading.effects['applyApplication/saveToApprove'],
    };
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add} ignore="true">
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
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
      showSearchTooltip: true,
      searchPlaceHolder: '应用代码、应用名称、描述说明、所属组代码、所属组名称',
      searchProperties: ['code', 'name', 'remark', 'groupCode', 'groupName'],
      searchWidth: 260,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findRequisitionByPage`,
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default Certificate;
