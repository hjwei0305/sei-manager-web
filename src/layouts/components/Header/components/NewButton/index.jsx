import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { router } from 'umi';
import { Menu } from 'antd';
import { ExtIcon } from 'suid';
import ExtDropdown from '@/components/ExtDropdown';
import { userInfoOperation, constants } from '@/utils';

import styles from './index.less';

const { NoMenuNewApply } = constants;
const { getCurrentUser } = userInfoOperation;

@connect(() => ({}))
class NewButton extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = getCurrentUser();
  }

  handlerNew = e => {
    const { key } = e;
    const its = NoMenuNewApply.filter(it => it.id === key);
    if (its.length === 1) {
      const { dispatch } = this.props;
      dispatch({
        type: 'menu/openTab',
        payload: {
          activedMenu: its[0],
        },
      }).then(() => {
        router.push(its[0].url);
      });
    }
  };

  dropdownRender = () => {
    const menu = (
      <Menu selectedKeys={[]} onClick={this.handlerNew} className={cls(styles['new-menu-item'])}>
        {NoMenuNewApply.map(it => {
          return (
            <Menu.Item key={it.id}>
              <ExtIcon type={it.icon} antd />
              {it.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return menu;
  };

  render() {
    return (
      <ExtDropdown overlay={this.dropdownRender()}>
        <span className={cls(styles['new-icon-wrapper'], 'trigger')}>
          <ExtIcon type="plus-circle" theme="filled" antd />
        </span>
      </ExtDropdown>
    );
  }
}

export default NewButton;
