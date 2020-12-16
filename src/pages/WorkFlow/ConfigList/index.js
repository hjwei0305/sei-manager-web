import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag, Popconfirm, Drawer } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ workflow, loading }) => ({ workflow, loading }))
class ConfigList extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/saveFlowTypeNode',
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

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  onCancelBatchRemove = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  deleteFlowTypeNode = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys: ids } = this.state;
    dispatch({
      type: 'workflow/deleteFlowTypeNode',
      payload: ids,
      callback: res => {
        if (res.success) {
          this.setState({
            selectedRowKeys: [],
          });
          this.reloadData();
        }
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderNodeName = (t, row) => {
    return (
      <>
        <Tag>{row.code}</Tag>
        {t}
      </>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const { workflow, loading } = this.props;
    const { currentFlowType, showModal, rowData } = workflow;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 80,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              antd
            />
          </span>
        ),
      },
      {
        title: '审核节点名称',
        dataIndex: 'name',
        width: 220,
        render: this.renderNodeName,
      },
      {
        title: '审核人',
        dataIndex: 'handleUserName',
        width: 100,
      },
      {
        title: '审核节点描述',
        dataIndex: 'remark',
        width: 280,
        render: t => t || '-',
      },
    ];
    const removing = loading.effects['workflow/deleteFlowTypeNode'];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            新建审核节点
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={hasSelected}
          >
            <Button onClick={this.onCancelBatchRemove} disabled={removing}>
              取消
            </Button>
            <Popconfirm title="确定要移除选择的节点吗？" onConfirm={this.deleteFlowTypeNode}>
              <Button type="danger" loading={removing}>
                {`删除( ${selectedRowKeys.length} )`}
              </Button>
            </Popconfirm>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      toolBar: toolBarProps,
      columns,
      checkbox: true,
      selectedRowKeys,
      onSelectRow: this.handlerSelectRow,
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '节点名称、描述关键字',
      searchProperties: ['name', 'remark'],
      searchWidth: 260,
      store: {
        url: `${SERVER_PATH}/sei-manager/flow/definition/getTypeNode`,
      },
      lineNumber: false,
      cascadeParams: {
        typeId: get(currentFlowType, 'id'),
      },
    };
    const formModalProps = {
      showModal,
      rowData,
      currentFlowType,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['workflow/saveFlowTypeNode'],
      save: this.save,
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(currentFlowType, 'remark')} subTitle="审核节点列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default ConfigList;
