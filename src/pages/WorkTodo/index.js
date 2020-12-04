import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { get, trim } from 'lodash';
import moment from 'moment';
import withRouter from 'umi/withRouter';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Tag, Modal, Input } from 'antd';
import { ExtTable, message, ExtIcon } from 'suid';
import { FilterView } from '@/components';
import { constants } from '../../utils';
import styles from './index.less';

const { FLOW_OPERATION_TYPE, APPLY_ORDER_TYPE } = constants;
const { TextArea } = Input;
const taskColor = d => {
  const days = moment().diff(d, 'days');
  if (days <= 1) {
    return '#52c41a';
  }
  if (days <= 30) {
    return '#fa8c16';
  }
  return '#f5222d';
};

@withRouter
@connect(({ taskWorkTodo, loading }) => ({ taskWorkTodo, loading }))
class WorkTodo extends PureComponent {
  static confirmModal;

  static messageText;

  handlerAction = (key, record) => {
    switch (key) {
      case FLOW_OPERATION_TYPE.REJECT:
        this.approveReject(record);
        break;
      case FLOW_OPERATION_TYPE.PASSED:
        this.approvePassed(record);
        break;
      default:
    }
  };

  handlerMessageText = e => {
    this.messageText = trim(e.target.value);
  };

  approvePassed = rowData => {
    const { dispatch } = this.props;
    this.confirmModal = Modal.confirm({
      title: `审核通过确认`,
      content: `你确定要审核通过吗？`,
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
            type: 'taskWorkTodo/submitHanlder',
            payload: {
              requisitionId: rowData.orderId,
              message: '审核通过',
              operationType: FLOW_OPERATION_TYPE.PASSED,
              taskId: rowData.id,
            },
            callback: res => {
              if (res.success) {
                resolve();
                this.handlerRefresh();
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

  approveReject = rowData => {
    const { dispatch } = this.props;
    this.confirmModal = Modal.confirm({
      title: '审核拒绝',
      content: (
        <TextArea
          style={{ resize: 'none' }}
          placeholder="请输入审核拒绝的原因"
          rows={3}
          onChange={this.handlerMessageText}
        />
      ),
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
              type: 'taskWorkTodo/submitHanlder',
              payload: {
                requisitionId: rowData.orderId,
                message: this.messageText,
                operationType: FLOW_OPERATION_TYPE.REJECT,
                taskId: rowData.id,
              },
              callback: res => {
                if (res.success) {
                  message.destroy();
                  resolve();
                  this.handlerRefresh();
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
            message.error('请输入审核拒绝的原因');
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

  handlerViewTypeChange = currentViewType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskWorkTodo/getWorkTodoList',
      payload: {
        currentViewType,
      },
    });
  };

  handlerRefresh = () => {
    const {
      dispatch,
      taskWorkTodo: { currentViewType },
    } = this.props;
    dispatch({
      type: 'taskWorkTodo/getWorkTodoList',
      payload: {
        currentViewType,
      },
    });
  };

  renderApplyType = t => {
    const orderType = APPLY_ORDER_TYPE[t];
    if (orderType) {
      return orderType.remark;
    }
    return t || '-';
  };

  render() {
    const { taskWorkTodo, loading } = this.props;
    const { currentViewType, viewTypeData, todoData } = taskWorkTodo;
    const columns = [
      {
        key: 'operation',
        width: 90,
        align: 'center',
        dataIndex: 'id',
        title: '操作',
        fixed: 'left',
        className: 'action',
        required: true,
        render: (id, record) => {
          return (
            <span className={cls('action-box')}>
              <ExtIcon
                className="passed"
                tooltip={{ title: '审核通过' }}
                type="check"
                antd
                onClick={() => this.approvePassed(record)}
              />
              <ExtIcon
                className="reject"
                tooltip={{ title: '审核拒绝' }}
                type="close"
                antd
                onClick={() => this.approveReject(record)}
              />
            </span>
          );
        },
      },
      {
        title: '申请类型',
        dataIndex: 'applyType',
        width: 120,
        optional: currentViewType.name !== APPLY_ORDER_TYPE.ALL.name,
        render: this.renderApplyType,
      },
      {
        title: '事项名称',
        dataIndex: 'taskName',
        width: 220,
        render: flowName => {
          return <span title={flowName}>{flowName}</span>;
        },
      },
      {
        title: '事项摘要',
        dataIndex: 'summary',
        width: 480,
        render: (_text, record) => {
          if (record) {
            const res = get(record, 'summary', '');
            return <span title={res}>{res}</span>;
          }
          return null;
        },
      },
      {
        title: '事项发起人',
        dataIndex: 'initiatorUserName',
        width: 100,
        render: (_text, record) => {
          if (record) {
            const creatorName = get(record, 'initiatorUserName', '');
            const creatorAccount = get(record, 'initiatorAccount', '');
            return <span title={creatorAccount}>{creatorName}</span>;
          }
          return null;
        },
      },
      {
        title: '提交时间',
        dataIndex: 'initTime',
        width: 120,
        render: (_text, record) => {
          if (record) {
            return (
              <Tag color={taskColor(record.initTime)}>
                <span title={moment(record.initTime).format('YYYY-MM-DD HH:mm:ss')}>
                  {moment(record.initTime).fromNow()}
                </span>
              </Tag>
            );
          }
          return null;
        },
      },
    ];
    const toolBarProps = {
      layout: { leftSpan: 10, rightSpan: 14 },
      left: (
        <>
          <FilterView
            currentViewType={currentViewType}
            viewTypeData={viewTypeData}
            onAction={this.handlerViewTypeChange}
            reader={{ title: 'remark', value: 'name' }}
          />
          <Button onClick={this.handlerRefresh} className="btn-item">
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      loading: loading.effects['taskWorkTodo/getWorkTodoList'],
      dataSource: todoData,
      searchWidth: 320,
      storageId: 'c34581a9-6f8c-40f1-9a01-466571aaedb0',
      searchPlaceHolder: '请输入摘要、任务名称、任务号关键字查询',
      searchProperties: ['taskName', 'taskNo', 'summary'],
      showSearchTooltip: false,
      sort: {
        field: {
          initTime: 'asc',
          taskNo: null,
          taskName: null,
        },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...extTableProps} />
      </div>
    );
  }
}

export default WorkTodo;
