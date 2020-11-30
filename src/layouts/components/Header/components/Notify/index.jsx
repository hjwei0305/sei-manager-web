import React, { PureComponent } from 'react';
import { Badge, Icon, Dropdown, Tabs, Empty } from 'antd';
import emtpy from '@/assets/notice_emtpy.svg';
import styles from './index.less';

const { TabPane } = Tabs;

class Notify extends PureComponent {
  static messageTimer;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      messageCount: 0,
    };
  }

  componentDidMount() {
    this.messageTimer = setInterval(() => {
      console.log('定时器');
    }, 36000);
  }

  componentWillUnmount() {
    window.clearInterval(this.messageTimer);
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  getDropdownProps = () => {
    const { visible } = this.state;
    return {
      overlay: (
        <div className={styles['message-box']}>
          <Tabs animated={false}>
            <TabPane tab="待办" key="1">
              <Empty image={emtpy} description="你已完成所有待办" />
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
