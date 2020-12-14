import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input, Empty, Layout } from 'antd';
import { ListCard } from 'suid';
import empty from '@/assets/item_empty.svg';
import ConfigList from './ConfigList';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ workflow, loading }) => ({ workflow, loading }))
class WorkFlow extends Component {
  static listCardRef = null;

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

  closeAssignStages = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workflow/updateState',
      payload: {
        showModal: false,
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

  render() {
    const { workflow } = this.props;
    const { currentFlowType, flowTypeData } = workflow;
    const workflowTypeProps = {
      className: 'left-content',
      title: '流程类型列表',
      showSearch: false,
      dataSource: flowTypeData,
      onSelectChange: this.handlerSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['remark', 'name'],
      itemField: {
        title: item => item.remark,
        description: item => item.name,
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <ListCard {...workflowTypeProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {currentFlowType ? (
              <ConfigList />
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
export default WorkFlow;
