import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router } from 'umi';
import { get } from 'lodash';
import { Icon, Menu, Avatar } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ExtDropdown from '@/components/ExtDropdown';
import { userInfoOperation, constants } from '@/utils';
import styles from './index.less';

const { getCurrentUser } = userInfoOperation;
const { NoMenuPage } = constants;

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
        activedMenu: NoMenuPage.userProfile,
      },
    }).then(({ activedMenu }) => {
      router.push(activedMenu.url);
    });
  };

  handlerDashboardCustom = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: NoMenuPage['my-dashboard-home'],
      },
    });
  };

  handlerMyApply = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openTab',
      payload: {
        activedMenu: NoMenuPage['my-apply'],
      },
    }).then(({ activedMenu }) => {
      router.push(activedMenu.url);
    });
  };

  dropdownRender = () => {
    const menu = (
      <Menu selectedKeys={[]} className={cls(styles['user-menu-item'])}>
        <Menu.Item key="setting" onClick={this.handleSetting}>
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        {/* <Menu.Item key="my-dashboard-home" onClick={this.handlerDashboardCustom}>
          <Icon type="home" />
          {formatMessage({ id: 'app.dashboard.custom', desc: '自定义首页' })}
        </Menu.Item> */}
        <Menu.Item key="apply" onClick={this.handlerMyApply}>
          <Icon type="project" />
          我的申请单
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
