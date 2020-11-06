import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { ScrollBar, ListLoader } from 'suid';
import Directive from './Directive';
import NodeState from './State';
import FrontendMachine from '../FrontendMachine';
import styles from './index.less';

const { TabPane } = Tabs;
class OrderConfig extends PureComponent {
  static propTypes = {
    nodeDataLoading: PropTypes.bool,
    directiveData: PropTypes.object,
    saveDirective: PropTypes.func,
    directiveSaving: PropTypes.bool,
    currentNode: PropTypes.object,
    currentDockingChannel: PropTypes.object,
    saveState: PropTypes.func,
    stateSaving: PropTypes.bool,
    currentTabKey: PropTypes.string,
    onTabChange: PropTypes.func,
    saveFrontend: PropTypes.func,
    frontendSaving: PropTypes.bool,
    deleteFrontend: PropTypes.func,
    frontendDeleting: PropTypes.bool,
  };

  render() {
    const {
      nodeDataLoading,
      directiveData,
      saveDirective,
      directiveSaving,
      onTabChange,
      currentTabKey,
      ...rest
    } = this.props;
    const directiveProps = { directiveData, saveDirective, directiveSaving };
    return (
      <Tabs
        className={cls(styles['container-box'])}
        activeKey={currentTabKey || 'directive'}
        onChange={onTabChange}
        animated={false}
      >
        <TabPane tab="指令配置" key="directive" forceRender>
          <ScrollBar>
            {nodeDataLoading ? <ListLoader /> : <Directive {...directiveProps} />}
          </ScrollBar>
        </TabPane>
        <TabPane tab="状态配置" key="status" forceRender className="status-box">
          <NodeState {...rest} />
        </TabPane>
        <TabPane tab="前置机配置" key="frontend" forceRender className="status-box">
          <FrontendMachine {...rest} />
        </TabPane>
      </Tabs>
    );
  }
}

export default OrderConfig;
