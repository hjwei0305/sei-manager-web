import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import UserView from './UserView';
import StationView from './StationView';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { ROLE_VIEW } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '查看岗位',
    key: ROLE_VIEW.STATION,
    disabled: false,
  },
  {
    title: '查看用户',
    key: ROLE_VIEW.USER,
    disabled: false,
  },
  {
    title: '配置岗位',
    key: ROLE_VIEW.CONFIG_STATION,
    disabled: false,
  },
  {
    title: '配置用户',
    key: ROLE_VIEW.CONFIG_USER,
    disabled: false,
  },
];

class ExtAction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
    };
  }

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    if (e.key === ROLE_VIEW.STATION || e.key === ROLE_VIEW.USER) {
      this.setState({
        selectedKeys: e.key,
        menuShow: true,
      });
    } else {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      const { onAction, roleData } = this.props;
      if (onAction) {
        onAction(e.key, roleData);
      }
    }
  };

  getMenu = (menus, record) => {
    const { selectedKeys } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, record)}
        selectedKeys={[selectedKeys]}
      >
        {menus.map(m => {
          if (m.key === ROLE_VIEW.USER) {
            return (
              <Item key={m.key}>
                <UserView
                  key={`user-${m.key}`}
                  featureRoleId={record.id}
                  menuId={menuId}
                  title={m.title}
                />
              </Item>
            );
          }
          if (m.key === ROLE_VIEW.STATION) {
            return (
              <Item key={m.key}>
                <StationView featureRoleId={record.id} menuId={menuId} title={m.title} />
              </Item>
            );
          }
          return (
            <Item key={m.key} disabled={m.disabled}>
              <span className="view-popover-box-trigger">{m.title}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { roleData } = this.props;
    const { menuShow } = this.state;
    const menusData = menuData();
    return (
      <>
        {menusData.length > 0 ? (
          <Dropdown
            trigger={['click']}
            overlay={this.getMenu(menusData, roleData)}
            className="action-drop-down"
            placement="bottomLeft"
            visible={menuShow}
            onVisibleChange={this.onVisibleChange}
          >
            <ExtIcon className={cls('action-item')} type="more" antd />
          </Dropdown>
        ) : null}
      </>
    );
  }
}

export default ExtAction;
