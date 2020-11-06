import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { upperFirst } from 'lodash';
import { Layout, Empty, Input } from 'antd';
import { ListCard } from 'suid';
import { FilterView } from '@/components';
import empty from '@/assets/item_empty.svg';
import styles from './index.less';

const { Sider, Content } = Layout;

const { Search } = Input;

@connect(({ availableService, loading }) => ({ availableService, loading }))
class AvailableService extends PureComponent {
  static listCardRef;

  handlerServiceSelect = (keys, items) => {
    if (keys.length === 1) {
      const { dispatch } = this.props;
      dispatch({
        type: 'availableService/updateState',
        payload: {
          currentService: items[0],
        },
      });
    }
  };

  handlerEnvChange = currentEnvViewType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'availableService/updateState',
      payload: {
        currentEnvViewType,
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

  renderCustomTool = () => {
    const { availableService } = this.props;
    const { currentEnvViewType, envViewData } = availableService;
    return (
      <>
        <FilterView
          currentViewType={currentEnvViewType}
          viewTypeData={envViewData}
          onAction={this.handlerEnvChange}
        />
        <div>
          <Search
            style={{ width: 150 }}
            placeholder="输入服务关键字"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
          />
        </div>
      </>
    );
  };

  render() {
    const { loading, availableService } = this.props;
    const { currentService, serviceData } = availableService;
    const serviceListProps = {
      title: '服务列表',
      dataSource: serviceData,
      showSearch: false,
      loading: loading.effects['availableService/getServices'],
      onSelectChange: this.handlerServiceSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => upperFirst(item.name),
        description: item => item.code,
      },
    };
    return (
      <Layout className={cls(styles['role-box'])}>
        <Sider width={380} className={cls('left-content', 'auto-height')} theme="light">
          <ListCard {...serviceListProps} />
        </Sider>
        <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
          {currentService ? (
            ''
          ) : (
            <div className="blank-empty">
              <Empty image={empty} description="选择服务项显示详情" />
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

export default AvailableService;
