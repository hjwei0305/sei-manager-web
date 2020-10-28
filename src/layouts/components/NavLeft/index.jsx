import React, { Fragment } from 'react';
import { Menu, Icon, Row, Col } from 'antd';
import { Link } from 'umi';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { eventBus } from '@/utils';
import MenuSearch from '@/components/MenuSearch';
import FavoriteMenu from '@/components/FavoriteMenu';
import collapsedLogo from '../../../assets/sei.png';

import styles from './index.less';

const { SubMenu } = Menu;

class NavLeft extends React.Component {
  constructor(props) {
    super(props);
    const { activedMenuKey, menuConfig } = props;

    this.state = {
      currentSelectedKeys: [activedMenuKey],
      openKeys: this.getInitOpenKeys(menuConfig),
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const { activedMenuKey, menuConfig } = this.props;
    if (activedMenuKey !== nextProps.activedMenuKey) {
      this.updateCurrentSelected(nextProps.activedMenuKey);
    }
    if (!isEqual(menuConfig, nextProps.menuConfig)) {
      this.setState({
        openKeys: this.getInitOpenKeys(nextProps.menuConfig),
      });
    }
  }

  getInitOpenKeys = menuConfig => {
    if (menuConfig && menuConfig.length) {
      return [menuConfig[0].id];
    }
    return null;
  };

  handleMenuClick = item => {
    const { onMenuClick } = this.props;
    this.updateCurrentSelected(item.id);
    if (onMenuClick) {
      onMenuClick(item);
    }
  };

  handleLogoClick = () => {
    const { onLogoClick } = this.props;
    if (onLogoClick) {
      onLogoClick();
    }
  };

  handleCollect = (e, item) => {
    e.stopPropagation();
    const { id, favorite } = item;
    eventBus.emit(favorite ? 'deCollectMenu' : 'collectMenu', id);
  };

  updateCurrentSelected = key => {
    this.setState({
      currentSelectedKeys: [key],
    });
  };

  getMenuNavItemByMode = item => {
    const { mode } = this.props;
    if (mode !== 'iframe') {
      return (
        <Link to={item.url}>
          {item.iconType ? <Icon type={item.iconType} /> : null}
          <span>{item.title}</span>
          <Icon className="collect-icon" type="star" onClick={e => this.handleCollect(e, item)} />
        </Link>
      );
    }
    return (
      <Fragment>
        <span>
          {item.iconType ? <Icon type={item.iconType} /> : null}
          <span>{item.title}</span>
        </span>
        <Icon
          className={cls({
            'collect-icon-actived': item.favorite,
            'collect-icon': true,
          })}
          type="star"
          theme={item.favorite ? 'twoTone' : ''}
          onClick={e => this.handleCollect(e, item)}
        />
      </Fragment>
    );
  };

  // 递归渲染树形菜单
  renderMenu = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        const { collapsed } = this.props;
        const title = (
          <span>
            {item.iconType ? <Icon type={item.iconType} /> : <Icon type="profile" />}
            <span>{item.title}</span>
          </span>
        );

        return (
          <SubMenu title={title} key={item.id}>
            <div
              className={cls('submenu-hover-title')}
              style={{ display: collapsed ? 'block' : 'none' }}
            >
              {item.title}
            </div>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        <Menu.Item
          title={item.title}
          key={item.id}
          onClick={() => {
            this.handleMenuClick(item);
          }}
        >
          {this.getMenuNavItemByMode(item)}
        </Menu.Item>
      );
    });

  render() {
    const { currentSelectedKeys, openKeys } = this.state;
    const {
      collapsed,
      menuConfig = [],
      allLeafMenus,
      favoriteMenus,
      onCollapse,
      onSelectSearchMenu,
    } = this.props;
    const collapsedMenuLogo = collapsedLogo;
    return (
      <div
        className={cls({
          [styles['nav-left-wrapper']]: true,
          [styles['nav-left-wrapper-collapsed']]: collapsed,
        })}
      >
        <div className="layout-logo" onClick={this.handleLogoClick}>
          {collapsed ? (
            <img src={collapsedMenuLogo} alt="logo" />
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 700 }}>
              开发者运维平台
            </span>
          )}
        </div>
        <div className="layout-menu-search">
          {!collapsed ? (
            <Fragment>
              <Row type="flex" align="middle">
                <Col style={{ flex: 1 }}>
                  <MenuSearch onSelect={onSelectSearchMenu} data={allLeafMenus} />
                </Col>
                <Col style={{ width: 50 }}>
                  <FavoriteMenu
                    collapsed={collapsed}
                    data={favoriteMenus}
                    onSelect={onSelectSearchMenu}
                    onRemove={this.handleCollect}
                  />
                </Col>
              </Row>
            </Fragment>
          ) : (
            <Fragment>
              <Icon className="collapsed-search-icon" type="search" onClick={onCollapse} />
              <FavoriteMenu
                collapsed={collapsed}
                data={favoriteMenus}
                onSelect={onSelectSearchMenu}
                onRemove={this.handleCollect}
              />
            </Fragment>
          )}
        </div>
        <div
          className="layout-menu"
          onClick={e => {
            if (
              e.target.className &&
              e.target.className.includes('scrollbar-container') &&
              onCollapse &&
              collapsed
            ) {
              onCollapse();
            }
          }}
        >
          {openKeys ? (
            <ScrollBar>
              <Menu
                defaultOpenKeys={openKeys}
                selectedKeys={currentSelectedKeys}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
              >
                {this.renderMenu(menuConfig)}
              </Menu>
            </ScrollBar>
          ) : null}
        </div>
        <div className="layout-menu-collapse" onClick={onCollapse}>
          {!collapsed ? (
            <Fragment>
              <Icon className="collapse-icon" type="double-left" />
              <span>收起菜单</span>
            </Fragment>
          ) : (
            <Icon type="double-right" />
          )}
        </div>
      </div>
    );
  }
}

export default NavLeft;
