import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Popconfirm, Button, Card, Tag } from 'antd';
import { ExtTable, ExtIcon, BannerTitle } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH, REQUEST_TYPE } = constants;

@connect(({ feature, loading }) => ({ feature, loading }))
class FeatureHandler extends Component {
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
      type: 'feature/updateState',
      payload: {
        showHandlerFormModal: true,
        currentFeatureHandler: null,
      },
    });
  };

  edit = currentFeatureHandler => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showHandlerFormModal: true,
        currentFeatureHandler,
      },
    });
  };

  showFeatureItem = currentFeatureHandler => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showFeatureItem: true,
        currentFeatureHandler,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/saveFeatureHandler',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeHandlerFormModal();
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
          type: 'feature/delFeatureHandler',
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

  closeHandlerFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showHandlerFormModal: false,
        currentFeatureHandler: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['feature/delFeatureHandler'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
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
    const { loading, feature } = this.props;
    const { showHandlerFormModal, currentFeatureHandler, selectedFeaturePage } = feature;
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
            <Popconfirm
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: '确定要删除吗?',
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '权限代码',
        dataIndex: 'permission',
        width: 160,
      },
      {
        title: '权限名称',
        dataIndex: 'name',
        width: 140,
        required: true,
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        width: 80,
        render: this.renderRequestMethod,
      },
      {
        title: '接口地址',
        dataIndex: 'url',
        width: 380,
        render: text => text || '-',
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
      onTableRef: ref => (this.tableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-manager/feature/findChildByFeatureId`,
      },
      cascadeParams: { featureId: get(selectedFeaturePage, 'id') },
    };
    const formModalProps = {
      save: this.save,
      selectedFeaturePage,
      currentFeatureHandler,
      showFormModal: showHandlerFormModal,
      closeFormModal: this.closeHandlerFormModal,
      saving: loading.effects['feature/saveFeatureHandler'],
    };
    return (
      <div className={cls(styles['feature-page-box'])}>
        <Card
          title={
            <BannerTitle title={`${get(selectedFeaturePage, 'name')}`} subTitle="页面功能权限" />
          }
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default FeatureHandler;
