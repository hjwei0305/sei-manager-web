import React, { Component } from 'react';
import { connect } from 'dva';
import { get } from 'lodash';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Empty, Popconfirm, Layout } from 'antd';
import { ExtIcon, ListCard, AuthAction } from 'suid';
import empty from '@/assets/item_empty.svg';
import { UseStatus } from '@/components';
import { constants } from '@/utils';
import Add from './components/Form/Add';
import Edit from './components/Form/Edit';
import ValueItem from './components/ValueItem';
import styles from './index.less';

const { SERVER_PATH, USER_STATUS } = constants;
const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ configEvnVar, loading }) => ({ configEvnVar, loading }))
class ConfigEvnVar extends Component {
  static listCardRef = null;

  static assignedUserRef = null;

  constructor(props) {
    super(props);
    this.state = {
      delId: null,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `configEvnVar/updateState`,
      payload: {
        showFormModal: false,
      },
    });
  }

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  save = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: `configEvnVar/save`,
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.reloadData();
          if (handlerPopoverHide) handlerPopoverHide();
        }
      },
    });
  };

  del = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delId: data.id,
      },
      () => {
        dispatch({
          type: 'configEvnVar/del',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  handlerSelect = (keys, items) => {
    const { dispatch } = this.props;
    const selectedEvnVar = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'configEvnVar/updateState',
      payload: {
        selectedEvnVar,
        editHanlderValue: false,
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
      <Search
        allowClear
        placeholder="输入键名、描述关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { delId } = this.state;
    const saving = loading.effects['configEvnVar/save'];
    const useStatus = get(item, 'useStatus');
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <AuthAction>
            <Edit authCode="EDIT" saving={saving} save={this.save} data={item} />
          </AuthAction>
          {useStatus === USER_STATUS.NONE.key ? (
            <AuthAction>
              <Popconfirm
                authCode="DELETE"
                title={formatMessage({
                  id: 'global.delete.confirm',
                  defaultMessage: '确定要删除吗?',
                })}
                onConfirm={e => this.del(item, e)}
              >
                {loading.effects['configEvnVar/del'] && delId === item.id ? (
                  <ExtIcon className={cls('del', 'action-item', 'loading')} type="loading" antd />
                ) : (
                  <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                )}
              </Popconfirm>
            </AuthAction>
          ) : null}
        </div>
      </>
    );
  };

  render() {
    const { loading, configEvnVar } = this.props;
    const { selectedEvnVar } = configEvnVar;
    const saving = loading.effects['configEvnVar/save'];
    const selectedKeys = selectedEvnVar ? [selectedEvnVar.id] : [];
    const userGroupProps = {
      className: 'left-content',
      title: '环境变量',
      showSearch: false,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['code', 'remark'],
      selectedKeys,
      extra: (
        <AuthAction>
          <Add authCode="CREATE" saving={saving} save={this.save} />
        </AuthAction>
      ),
      itemField: {
        title: item => (
          <>
            {item.code}
            <UseStatus status={item.useStatus} />
          </>
        ),
        description: item => item.remark,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/envVariable/getAllKey`,
      },
      itemTool: this.renderItemAction,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...userGroupProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {selectedEvnVar ? (
              <ValueItem />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default ConfigEvnVar;
