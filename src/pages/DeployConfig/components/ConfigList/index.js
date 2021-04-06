import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Popconfirm, Modal } from 'antd';
import { ExtTable, BannerTitle, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;
const FILTER_FIELDS = [];

@connect(({ deployConfig, loading }) => ({ deployConfig, loading }))
class ConfigList extends Component {
  static tableRef;

  static confirmModal;

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
      type: 'deployConfig/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployConfig/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deployConfig/save',
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
          type: 'deployConfig/remove',
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
      type: 'deployConfig/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  getFilter = () => {
    const { deployConfig } = this.props;
    const { configFilter, currentModule } = deployConfig;
    const filters = [
      { fieldName: 'appId', operator: 'EQ', value: get(currentModule, 'appId') },
      { fieldName: 'moduleId', operator: 'EQ', value: get(currentModule, 'id') },
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

  initConfirm = rowData => {
    const { dispatch } = this.props;
    if (rowData.initialized) {
      return false;
    }
    this.confirmModal = Modal.confirm({
      title: `模块初始化部署确认`,
      content: `规则：模块初始化部署将从dev分支拉取代码构建后进行部署`,
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
            type: 'deployConfig/initDeploy',
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

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['deployConfig/remove'] && delRowId === row.id) {
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

  render() {
    const { deployConfig, loading } = this.props;
    const { currentModule, showModal, rowData } = deployConfig;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 140,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <ExtIcon
              tooltip={{ title: record.initialized ? '' : '模块初始化部署' }}
              onClick={() => this.initConfirm(record)}
              type="play-circle"
              className={record.initialized ? 'disabled' : ''}
              antd
            />
            <ExtIcon className="edit" onClick={() => this.edit(record)} type="edit" antd />
            {this.renderDelBtn(record)}
          </span>
        ),
      },
      {
        title: '部署配置名称',
        dataIndex: 'name',
        width: 260,
        required: true,
      },
      {
        title: '环境名称',
        dataIndex: 'envName',
        width: 160,
        required: true,
      },
      {
        title: '模版名称',
        dataIndex: 'tempName',
        width: 280,
        render: t => t || '-',
      },
      {
        title: '描述说明',
        dataIndex: 'remark',
        width: 480,
        render: t => t || '-',
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            新建配置
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      lineNumber: false,
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
        url: `${SERVER_PATH}/sei-manager/deployConfig/findByPage`,
      },
      cascadeParams: {
        ...this.getFilter(),
      },
    };
    const formModalProps = {
      showModal,
      rowData,
      currentModule,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['deployConfig/save'],
      save: this.save,
    };
    return (
      <div className={cls(styles['user-box'])}>
        <Card
          title={<BannerTitle title={get(currentModule, 'name')} subTitle="配置列表" />}
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
