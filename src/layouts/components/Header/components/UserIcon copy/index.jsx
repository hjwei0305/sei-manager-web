import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get, cloneDeep } from 'lodash';
import { Icon, Menu, Avatar } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ExtDropdown from '@/components/ExtDropdown';
import {
  userInfoOperation,
  constants,
} from '../../../../../pages/ModuleTag/components/TagList/node_modules/@/utils';

import styles from './index.less';

const { NoMenuPages } = constants;
const { getCurrentUser } = userInfoOperation;

@connect(() => ({}))
class UserIcon extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = getCurrentUser();
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/userLogout',
    });
  };

  handleSetting = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: cloneDeep(NoMenuPages[0]),
      },
    });
    // .then(({ activedMenu }) => {
    //   router.push(activedMenu.url);
    // });
  };

  handlerDashboardCustom = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: {
          id: 'my-dashboard-home',
          title: '自定义首页',
          url: '/sei-dashboard-web/scene/myHome',
        },
      },
    });
  };

  dropdownRender = () => {
    const menu = (
      <Menu selectedKeys={[]} className={cls(styles['user-menu-item'])}>
        <Menu.Item key="setting" onClick={this.handleSetting}>
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        <Menu.Item key="my-dashboard-home" onClick={this.handlerDashboardCustom}>
          <Icon type="home" />
          {formatMessage({ id: 'app.dashboard.custom', desc: '自定义首页' })}
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.handleClick}>
          <Icon type="logout" />
          {formatMessage({ id: 'app.logout', desc: '退出' })}
        </Menu.Item>
      </Menu>
    );

    return menu;
  };

  render() {
    return (
      <ExtDropdown overlay={this.dropdownRender()}>
        <span className={cls(styles['user-icon-wrapper'], 'trigger')}>
          <Avatar icon={<img alt="" src={get(this.currentUser, 'portrait')} />} size="13" />
          <span className={cls('username')}>{this.currentUser && this.currentUser.userName}</span>
        </span>
      </ExtDropdown>
    );
  }
}

export default UserIcon;
