import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Badge, Icon, Dropdown, Card, Empty, List } from 'antd';
import { ScrollBar } from 'suid';
import { AplayAudio } from '@/components';
import emtpy from '@/assets/notice_emtpy.svg';
import { getTodoTaskNum } from '@/services/notify';
import { constants } from '@/utils';
import styles from './index.less';

const { APPLY_ORDER_TYPE, NoMenuPage } = constants;

@connect(() => ({}))
class Notify extends PureComponent {
  static messageTimer;

  static aplayAudioRef;

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
      if (success) {
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
            if (messageCount > 0) {
              if (this.aplayAudioRef) {
                this.aplayAudioRef.aplayAudio();
              }
            }
          },
        );
      }
    });
  };

  handlerTodoItem = item => {
    const { dispatch } = this.props;
    const url = `/my-center/workTodo?t=${item.name}`;
    const activedMenu = NoMenuPage.myTodoList;
    Object.assign(activedMenu, { url });
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu,
      },
    }).then(() => {
      router.push(activedMenu.url);
    });
    this.setState({
      visible: false,
    });
  };

  renderTodoList = () => {
    const { todoData } = this.state;
    return (
      <Card title="待办信息" bordered={false} size="small">
        {todoData.length === 0 ? (
          <Empty image={emtpy} description="你已完成所有待办" />
        ) : (
          <ScrollBar>
            <List
              itemLayout="horizontal"
              dataSource={todoData}
              renderItem={item => (
                <List.Item onClick={() => this.handlerTodoItem(item)}>
                  <List.Item.Meta title={item.remark} />
                  <Badge count={item.count} />
                </List.Item>
              )}
            />
          </ScrollBar>
        )}
      </Card>
    );
  };

  getDropdownProps = () => {
    const { visible } = this.state;
    return {
      overlay: <div className={styles['message-box']}>{this.renderTodoList()}</div>,
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
        <AplayAudio onAudioRef={ref => (this.aplayAudioRef = ref)} />
      </>
    );
  }
}

export default Notify;
