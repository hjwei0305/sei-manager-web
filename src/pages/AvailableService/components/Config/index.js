import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import Instance from '../Instance';
import Interface from '../Interface';
import styles from './index.less';

const { TabPane } = Tabs;
class ServiceConfig extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    currentService: PropTypes.object,
    currentEnvViewType: PropTypes.object,
    currentTabKey: PropTypes.string,
    onTabChange: PropTypes.func,
    interfaceData: PropTypes.object,
    onSaveInterface: PropTypes.func,
    interfaceSaving: PropTypes.bool,
    onDeleteInterface: PropTypes.func,
    interfaceDeleting: PropTypes.bool,
    instanceData: PropTypes.object,
    onDeleteInstance: PropTypes.func,
    instanceDeleting: PropTypes.bool,
  };

  render() {
    const {
      onTabChange,
      currentTabKey,
      loading,
      currentService,
      currentEnvViewType,
      instanceData,
      onDeleteInstance,
      instanceDeleting,
      ...rest
    } = this.props;
    const interfaceProps = {
      loading,
      currentService,
      ...rest,
    };
    const instanceProps = {
      loading,
      currentService,
      currentEnvViewType,
      instanceData,
      onDeleteInstance,
      instanceDeleting,
    };
    return (
      <Tabs
        className={cls(styles['container-box'])}
        activeKey={currentTabKey || 'instanceTab'}
        onChange={onTabChange}
        animated={false}
      >
        <TabPane tab={`服务实例 (${instanceData.length})`} key="instanceTab" forceRender>
          <Instance {...instanceProps} />
        </TabPane>
        <TabPane
          tab={`接口配置 (${rest.interfaceData.length})`}
          key="interfaceTab"
          forceRender
          className="tab-box"
        >
          <Interface {...interfaceProps} />
        </TabPane>
      </Tabs>
    );
  }
}

export default ServiceConfig;
