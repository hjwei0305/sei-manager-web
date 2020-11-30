import React, { PureComponent } from 'react';
import { Badge, Icon, Dropdown, Tabs, Empty } from 'antd';
import { ListCard } from 'suid';
import emtpy from '@/assets/notice_emtpy.svg';
import { getTodoTaskNum } from '@/services/notify';
import { constants, speech } from '@/utils';
import styles from './index.less';

const { APPLY_ORDER_TYPE } = constants;
const { TabPane } = Tabs;

class Notify extends PureComponent {
  static messageTimer;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      messageCount: 0,
      todoData: [],
    };
  }

  componentDidMount() {
    this.getMessageCount();
    this.messageTimer = setInterval(() => {
      this.getMessageCount();
    }, 36000);
  }

  componentWillUnmount() {
    window.clearInterval(this.messageTimer);
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  getMessageCount = () => {
    getTodoTaskNum().then(result => {
      const { success, data } = result || {};
      if (success && Object.keys(data).length > 0) {
        const { messageCount: oldMessageCount } = this.state;
        const todoData = [];
        let messageCount = 0;
        Object.keys(data).forEach(todoKey => {
          const count = data[todoKey];
          messageCount += count;
          const orderType = APPLY_ORDER_TYPE[todoKey];
          if (orderType) {
            todoData.push({
              name: todoKey,
              remark: orderType.remark,
              count,
            });
          }
        });
        this.setState(
          {
            messageCount,
            todoData,
          },
          () => {
            if (messageCount > oldMessageCount) {
              speech(`您有新的未处理的消息`);
            }
          },
        );
      }
    });
  };

  renderTodoList = () => {
    const { todoData } = this.state;
    if (todoData.length === 0) {
      return <Empty image={emtpy} description="你已完成所有待办" />;
    }
    const todoListProps = {
      dataSource: todoData,
      rowKey: 'name',
      showSearch: false,
      pagination: false,
      onSelectChange: (keys, items) => {
        console.log(keys, items);
      },
      customTool: () => null,
      itemField: {
        title: item => item.remark,
        extra: item => (
          <Badge style={{ marginRight: 8 }} title={`有 ${item.count} 条待办`} count={item.count} />
        ),
      },
    };
    return <ListCard {...todoListProps} />;
  };

  getDropdownProps = () => {
    const { visible } = this.state;
    return {
      overlay: (
        <div className={styles['message-box']}>
          <Tabs animated={false}>
            <TabPane tab="待办" key="1">
              {this.renderTodoList()}
            </TabPane>
            <TabPane tab="通知" key="2">
              <Empty image={emtpy} description="你已查看所有通知" />
            </TabPane>
            <TabPane tab="消息" key="3">
              <Empty image={emtpy} description="你已读完所有消息" />
            </TabPane>
          </Tabs>
        </div>
      ),
      visible,
      placement: 'bottomLeft',
      trigger: ['click'],
      onVisibleChange: this.handleVisibleChange,
    };
  };

  render() {
    const { messageCount } = this.state;
    const { className } = this.props;
    return (
      <>
        <Dropdown {...this.getDropdownProps()}>
          <span id="notify-container" className={className}>
            <Badge count={messageCount}>
              <Icon type="bell" style={{ padding: 6, fontSize: 20 }} />
            </Badge>
          </span>
        </Dropdown>
      </>
    );
  }
}

export default Notify;
