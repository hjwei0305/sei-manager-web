import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input, Empty, Layout, Popconfirm } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import ConfigList from './ConfigList';
import FlowHistory from './FlowHistory';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;
const { SERVER_PATH } = constants;

@connect(({ workflow, loading }) => ({ workflow, loading }))
class WorkFlow extends Component {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {
      dealId: null,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showModal: false,
        currentFlowType: null,
        rowData: null,
      },
    });
  }

  reloadData = () => {
    if (this.listCardRef) {
      this.listCardRef.remoteDataRefresh();
    }
  };

  handlerSelect = (keys, items) => {
    const { dispatch } = this.props;
    const currentFlowType = keys.length === 1 ? items[0] : null;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        currentFlowType,
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

  publish = (data, e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        dealId: data.id,
      },
      () => {
        dispatch({
          type: 'workflow/publishFlowType',
          payload: {
            typeId: data.id,
          },
          callback: res => {
            if (res.success) {
              this.reloadData();
            }
          },
        });
      },
    );
  };

  closeHistoryModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showFlowHistory: false,
        historyFlowType: null,
      },
    });
  };

  handlerShowFlowHistory = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showFlowHistory: true,
        historyFlowType: item,
      },
    });
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="输入名称、描述关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  renderItemAction = item => {
    const { loading } = this.props;
    const { dealId } = this.state;
    const publishing = loading.effects['workflow/publishFlowType'];
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <Popconfirm title="确定要发布吗?" onConfirm={e => this.publish(item, e)}>
            {publishing && dealId === item.id ? (
              <ExtIcon className={cls('action-item', 'loading')} type="sync" spin antd />
            ) : (
              <ExtIcon className={cls('action-item', 'publish')} type="play-circle" antd />
            )}
          </Popconfirm>
          <ExtIcon
            className={cls('action-item')}
            type="history"
            onClick={() => this.handlerShowFlowHistory(item)}
            antd
          />
        </div>
      </>
    );
  };

  render() {
    const { workflow } = this.props;
    const { currentFlowType, showFlowHistory, historyFlowType } = workflow;
    const workflowTypeProps = {
      className: 'left-content',
      title: '流程类型列表',
      showSearch: false,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['remark', 'name'],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/flow/definition/findTypeByPage`,
      },
      remotePaging: true,
      itemField: {
        title: item => item.name,
        description: item => item.remark,
        extra: item => <span style={{ fontSize: 12, marginRight: 8 }}>{`V${item.version}`}</span>,
      },
      itemTool: this.renderItemAction,
    };
    const flowHistoryProps = {
      showFlowHistory,
      historyFlowType,
      closeFormModal: this.closeHistoryModal,
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...workflowTypeProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {currentFlowType ? (
              <ConfigList />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左边列表项进行相应的操作" />
              </div>
            )}
          </Content>
        </Layout>
        <FlowHistory {...flowHistoryProps} />
      </div>
    );
  }
}
export default WorkFlow;
