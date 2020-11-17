import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Empty, Input, Popconfirm, Layout, Button } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import AssignedFeature from './components/Role/AssignedFeature';
import UnAssignFeature from './components/Role/UnAssignFeature';
import FormModal from './FormModal';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;
const { SERVER_PATH } = constants;

@connect(({ featureRole, loading }) => ({
  featureRole,
  loading,
}))
class Role extends Component {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      delRoleId: null,
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
      type: 'featureRole/updateState',
      payload: {
        showRoleFormModal: true,
        currentFeatureRole: null,
      },
    });
  };

  edit = (currentFeatureRole, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showRoleFormModal: true,
        currentFeatureRole,
      },
    });
  };

  closeRoleFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showRoleFormModal: false,
        currentFeatureRole: null,
      },
    });
  };

  handlerFeatureRoleSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedFeatureRole = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        selectedFeatureRole,
      },
    });
  };

  saveFeatureRole = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/saveFeatureRole',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeRoleFormModal();
          this.reloadData();
        }
      },
    });
  };

  delFeatureRole = (data, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delRoleId: data.id,
      },
      () => {
        dispatch({
          type: 'featureRole/delFeatureRole',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRoleId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
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

  closeAssignFeature = () => {};

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delRoleId } = this.state;
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
            onConfirm={e => this.delFeatureRole(item, e)}
          >
            {loading.effects['featureRole/delFeatureRole'] && delRoleId === item.id ? (
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
    const { loading, featureRole } = this.props;
    const { currentFeatureRole, selectedFeatureRole, showRoleFormModal } = featureRole;
    const selectedKeys = selectedFeatureRole ? [selectedFeatureRole.id] : [];
    const featureRoleProps = {
      className: 'left-content',
      title: '角色列表',
      showSearch: false,
      onSelectChange: this.handlerFeatureRoleSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.description,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/role/findAll`,
      },
      extra: (
        <Button type="link" icon="plus" onClick={this.add}>
          新建
        </Button>
      ),
      itemTool: this.renderItemAction,
    };
    const formModalProps = {
      save: this.saveFeatureRole,
      currentFeatureRole,
      showRoleFormModal,
      closeRoleFormModal: this.closeRoleFormModal,
      saving: loading.effects['featureRole/saveFeatureRole'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className={cls('left-content', 'auto-height')} theme="light">
            <ListCard {...featureRoleProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedFeatureRole ? (
              <AssignedFeature />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择角色列表项进行功能项配置" />
              </div>
            )}
          </Content>
        </Layout>
        <FormModal {...formModalProps} />
        <UnAssignFeature />
      </div>
    );
  }
}

export default Role;
