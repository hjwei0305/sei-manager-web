import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Layout, Card, Input, Empty, Avatar, Tag } from 'antd';
import cls from 'classnames';
import { get, split, trim } from 'lodash';
import { ListCard, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import LogDetail from '../LogDetail';
import LogLevel from '../LogLevel';
import styles from './index.less';

const { Sider, Content } = Layout;
const { Search } = Input;
const colors = ['', 'magenta', 'purple', 'cyan', 'green'];

class TranceLog extends PureComponent {
  static scrollBarRef;

  static listCardRef;

  static propTypes = {
    currentLog: PropTypes.object,
    visible: PropTypes.bool,
    onCloseModal: PropTypes.func,
    loading: PropTypes.bool,
    logLoading: PropTypes.bool,
    logData: PropTypes.object,
    tranceData: PropTypes.array,
    onSelectLog: PropTypes.func,
  };

  static defaultProps = {
    tranceData: [],
    visible: false,
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

  renderCustomTool = ({ total }) => {
    return (
      <>
        <Search
          placeholder="可输入日志类或消息关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 260 }}
        />
        <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
      </>
    );
  };

  renderAvatar = ({ item, index }) => {
    const { currentLog } = this.props;
    if (currentLog && currentLog.id === item.id) {
      return <Avatar icon="check" size={22} shape="square" className="current-log" />;
    }
    return <Tag style={{ marginRight: 0 }}>{index + 1}</Tag>;
  };

  renderDesciption = item => {
    const { timestamp, tracePath } = item;
    // tracePath: "> sei-fim > sei-eai"
    const tracePathArr = split(tracePath, '>').filter(t => !!trim(t));
    const count = tracePathArr.length;
    return (
      <>
        <div className="vertical">
          <div className="horizontal">
            {tracePathArr.map((t, idx) => {
              if (count === 1 || idx === count - 1) {
                return (
                  <Tag color={colors[idx]} style={{ marginRight: 0 }}>
                    {t}
                  </Tag>
                );
              }
              return (
                <>
                  <Tag color={colors[idx]} style={{ marginRight: 0 }}>
                    {t}
                  </Tag>
                  <ExtIcon type="swap-right" antd />
                </>
              );
            })}
          </div>
          <div>{timestamp}</div>
        </div>
      </>
    );
  };

  render() {
    const {
      loading,
      logLoading,
      logData,
      tranceData,
      visible,
      onCloseModal,
      onSelectLog,
      currentLog,
    } = this.props;
    const selectedKey = get(currentLog, 'id') || '';
    const tranceListProps = {
      title: '链路列表',
      showSearch: false,
      selectedKeys: [selectedKey],
      dataSource: tranceData,
      searchProperties: ['message', 'logger'],
      onSelectChange: (keys, items) => {
        onSelectLog(keys, items);
      },
      loading,
      itemField: {
        avatar: this.renderAvatar,
        title: item => item.logger,
        description: this.renderDesciption,
        extra: item => <LogLevel item={item} />,
      },
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
    };
    return (
      <Modal
        mask={false}
        closable={false}
        wrapClassName={styles['trance-log-box']}
        visible={visible}
        footer={null}
        destroyOnClose
        onCancel={onCloseModal}
      >
        <Layout className={cls('log-content-wapper')}>
          <Sider width={480} className={cls('left-content', 'auto-height')} theme="light">
            <ListCard {...tranceListProps} />
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            <Card
              bordered={false}
              title="日志详情"
              extra={<ExtIcon type="close" antd onClick={onCloseModal} />}
            >
              {logData ? (
                <LogDetail loading={logLoading} logData={logData} />
              ) : (
                <div className="blank-empty">
                  <Empty image={empty} description="选择日志记录查看详情" />
                </div>
              )}
            </Card>
          </Content>
        </Layout>
      </Modal>
    );
  }
}

export default TranceLog;
