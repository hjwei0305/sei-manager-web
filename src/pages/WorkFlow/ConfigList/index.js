import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag, Popconfirm } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;
const FILTER_FIELDS = [];

@connect(({ workflow, loading }) => ({ workflow, loading }))
class ConfigList extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
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
      type: 'workflow/save',
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
          type: 'workflow/remove',
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
      type: 'workflow/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  getFilter = () => {
    const { workflow } = this.props;
    const { configFilter, currentFlowType } = workflow;
    const filters = [
      { fieldName: 'flowType', operator: 'EQ', value: get(currentFlowType, 'name') },
    ];
    FILTER_FIELDS.forEach(f => {
      const value = get(configFilter, f.fieldName, null) || null;
      if (value !== null && value !== '') {
        const param = { ...f };
        Object.assign(param, { value });
        filters.push(param);
      }
    });
    return { filters };
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['workflow/remove'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    if (row.release === true) {
      return <ExtIcon className="disabled" type="delete" antd />;
    }
    return (
      <Popconfirm
        title={formatMessage({
          id: 'global.delete.confirm',
          defaultMessage: '确定要删除吗？提示：删除后不可恢复',
        })}
        onConfirm={() => this.del(row)}
      >
        <ExtIcon className="del" type="delete" antd />
      </Popconfirm>
    );
  };

  renderNodeName = (t, row) => {
    return (
      <>
        <Tag>{row.rank}</Tag>
        {t}
      </>
    );
  };

  render() {
    const { workflow, loading } = this.props;
    const { currentFlowType, showModal, rowData } = workflow;
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
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              antd
            />
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '审核步骤名称',
        dataIndex: 'name',
        width: 280,
        render: this.renderNodeName,
      },
      {
        title: '审核步骤描述',
        dataIndex: 'remark',
        width: 480,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            新建审核步骤
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
      rowKey: 'name',
      onTableRef: ref => (this.tableRef = ref),
      searchPlaceHolder: '输入部署名称、描述关键字',
      searchProperties: ['name', 'remark'],
      searchWidth: 260,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/workflow/findByPage`,
      },
      cascadeParams: {
        ...this.getFilter(),
      },
    };
    const formModalProps = {
      showModal,
      rowData,
      currentFlowType,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['workflow/save'],
      save: this.save,
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(currentFlowType, 'remark')} subTitle="审核步骤列表" />}
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
