import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Popconfirm, Button, Card, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;

@connect(({ user, userGroup, loading }) => ({ user, userGroup, loading }))
class FeaturePage extends Component {
  static pageTableRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    if (this.pageTableRef) {
      this.pageTableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateState',
      payload: {
        showFormModal: true,
        currentUser: null,
      },
    });
  };

  edit = currentUser => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateState',
      payload: {
        showFormModal: true,
        currentUser,
      },
    });
  };

  showFeatureItem = currentUser => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateState',
      payload: {
        showFeatureItem: true,
        currentUser,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/saveFeature',
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
          type: 'user/delFeature',
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
      type: 'user/updateState',
      payload: {
        showFormModal: false,
        currentUser: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['user/delFeature'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  renderName = row => {
    let tag;
    if (row.tenantCanUse) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          租户可用
        </Tag>
      );
    }
    return (
      <>
        {row.name}
        {tag}
      </>
    );
  };

  render() {
    const { loading, userGroup, user } = this.props;
    const { currentFeatureGroup } = userGroup;
    const { appModuleName, name } = currentFeatureGroup;
    const { showFormModal, currentUser } = user;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
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
            <ExtIcon
              className="edit"
              onClick={() => this.showFeatureItem(record)}
              type="safety"
              tooltip={{ title: '页面功能项' }}
              antd
            />
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 200,
        optional: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 320,
        required: true,
        render: (_text, record) => this.renderName(record),
      },
      {
        title: '页面路由地址',
        dataIndex: 'groupCode',
        width: 380,
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
      cascadeParams: { userGroupId: currentFeatureGroup ? currentFeatureGroup.id : null },
      onTableRef: ref => (this.pageTableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-basic/user/findByFeatureGroupAndType?featureTypes=Page`,
      },
      sort: {
        field: { code: 'asc', name: null, groupCode: null },
      },
    };
    const formModalProps = {
      save: this.save,
      currentUser,
      showFormModal,
      currentFeatureGroup,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['user/saveFeature'],
    };
    return (
      <div className={cls(styles['user-page-box'])}>
        <Card
          title={<BannerTitle title={`${appModuleName} > ${name}`} subTitle="用户列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default FeaturePage;
