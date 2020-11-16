import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout, Button } from 'antd';
import { ExtIcon, ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import FeatureHandler from './FeatureHandler';
import PageFormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ feature, loading }) => ({ feature, loading }))
class Feature extends Component {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      delPageId: null,
    };
  }

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showPageFormModal: true,
        currentFeaturePage: null,
        currentFeatureHandler: null,
      },
    });
  };

  edit = (currentFeaturePage, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showPageFormModal: true,
        currentFeaturePage,
      },
    });
  };

  closePageFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/updateState',
      payload: {
        showPageFormModal: false,
        currentFeaturePage: null,
      },
    });
  };

  saveFeaturePage = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feature/saveFeature',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closePageFormModal();
          this.reloadData();
        }
      },
    });
  };

  delFeaturePage = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delPageId: data.id,
      },
      () => {
        dispatch({
          type: 'feature/delFeature',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delPageId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  handlerFeaturePageSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedFeaturePage = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'feature/updateState',
      payload: {
        selectedFeaturePage,
        showPageHandler: true,
      },
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderCustomTool = () => (
    <>
      <Button type="primary" onClick={this.add}>
        新建
      </Button>
      <Search
        allowClear
        placeholder="输入地址、名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: 220 }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delPageId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <ExtIcon
            className={cls('action-item')}
            type="edit"
            antd
            onClick={e => this.edit(item, e)}
          />
          <Popconfirm
            title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗?' })}
            onConfirm={e => this.delFeaturePage(item, e)}
          >
            {loading.effects['feature/delFeature'] && delPageId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  render() {
    const { feature, loading } = this.props;
    const { currentFeaturePage, showPageFormModal, showPageHandler, selectedFeaturePage } = feature;
    const { listData } = this.state;
    const selectedKeys = selectedFeaturePage ? [selectedFeaturePage.id] : [];
    const featurePageProps = {
      className: 'left-content',
      title: '页面功能项',
      showSearch: false,
      dataSource: listData,
      onSelectChange: this.handlerFeaturePageSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['url', 'name'],
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.url,
      },
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/feature/findByPage`,
        params: {
          filters: [{ fieldName: 'type', operator: 'EQ', value: 1 }],
        },
      },
      itemTool: this.renderItemAction,
    };
    const featureHandlerProps = {
      selectedFeaturePage,
    };
    const formModalProps = {
      save: this.saveFeaturePage,
      currentFeaturePage,
      showPageFormModal,
      closePageFormModal: this.closePageFormModal,
      saving: loading.effects['feature/saveFeature'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={420} className="auto-height" theme="light">
            <ListCard {...featurePageProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {showPageHandler ? (
              <FeatureHandler {...featureHandlerProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择左边列表项管理页面功能权限" />
              </div>
            )}
          </Content>
        </Layout>
        <PageFormModal {...formModalProps} />
      </div>
    );
  }
}
export default Feature;
