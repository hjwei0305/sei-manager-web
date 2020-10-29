import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Layout, Card, Input, Empty } from 'antd';
import cls from 'classnames';
import { ListCard, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import LogDetail from '../LogDetail';
import LogLevel from '../LogLevel';
import styles from './index.less';

const { Sider, Content } = Layout;
const { Search } = Input;

class TranceLog extends PureComponent {
  static scrollBarRef;

  static listCardRef;

  static propTypes = {
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

  render() {
    const {
      loading,
      logLoading,
      logData,
      tranceData,
      visible,
      onCloseModal,
      onSelectLog,
    } = this.props;
    const tranceListProps = {
      title: '链路列表',
      showSearch: false,
      dataSource: tranceData,
      searchProperties: ['message', 'logger'],
      onSelectChange: (keys, items) => {
        onSelectLog(keys, items);
      },
      loading,
      itemField: {
        title: item => item.logger,
        description: item => item.timestamp,
        extra: item => <LogLevel item={item} />,
      },
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
    };
    return (
      <Modal
        mask={false}
        closable={false}
        keyboard={false}
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
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
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
