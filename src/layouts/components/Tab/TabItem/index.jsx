import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import { Icon, Dropdown, Menu } from 'antd';
import { Link, router } from 'umi';
import { CSSTransition } from 'react-transition-group';
import { eventBus } from '@/utils';

import styles from './index.less';

export default class TabItem extends React.Component {
  static propTypes = {
    /** 页签items数据 */
    data: PropTypes.arrayOf(
      PropTypes.shape({
        /** 页签id */
        id: PropTypes.string,
        /** 页签名称 */
        title: PropTypes.string,
        /** 页签url地址 */
        url: PropTypes.string,
      }),
    ).isRequired,
    /** 页签的宽度 */
    width: PropTypes.number,
    /** 是否被激活 */
    actived: PropTypes.bool,
    /** 是否允许关闭页签 */
    closable: PropTypes.bool,
    /** 被激活的页签键值 */
    activedKey: PropTypes.string.isRequired,
    /** 页签被关闭时的回调函数 */
    onClose: PropTypes.func,
    /** 页签被点击时的回调函数 */
    onClick: PropTypes.func,
    /** 页签模式 */
    mode: PropTypes.string,
  };

  static defaultProps = {
    width: 100,
    actived: false,
    closable: true,
    onClose: null,
    onClick: null,
    mode: 'iframe',
  };

  state = {
    /** 下拉菜单是否可见 */
    dropdownVisible: false,
  };

  handleDropdownVisibleChange = dropdownVisible => {
    this.setState({ dropdownVisible });
  };

  handlePopupClick = () => {
    this.setState({ dropdownVisible: false });
  };

  handleClose = (e, id) => {
    e.stopPropagation();
    const { onClose } = this.props;
    if (onClose) {
      onClose(id);
    }
  };

  handleCollect = (e, id) => {
    e.stopPropagation();
    const { onCollect } = this.props;
    if (onCollect) {
      onCollect(id);
    } else {
      eventBus.emit('collectTab', id);
    }
  };

  handleRefresh = (e, id) => {
    e.stopPropagation();
    const { onRefresh } = this.props;
    if (onRefresh) {
      onRefresh(id);
    } else {
      eventBus.emit('refresh', id);
    }
  };

  getDropdownComponent = () => {
    const { data, onClick, onClose, activedKey, mode } = this.props;
    const { dropdownVisible } = this.state;
    const dropdownData = [...data];
    // const activedIndex = data.findIndex(({ id }) => id === activedKey);

    // if (activedIndex > -1) {
    //   dropdownData.splice(activedIndex, 1);
    // }

    return (
      <Trigger
        action={['click']}
        popup={
          <div className="tabs-more-wrap" onClick={this.handlePopupClick}>
            {dropdownData.map(({ title, url, id }) => (
              <div
                key={id}
                className={classNames({
                  'tabs-more-item': true,
                  'tabs-more-item_active': activedKey === id,
                })}
                title={title}
              >
                <div
                  onClick={() => {
                    onClick({ id, url, title });
                    if (mode !== 'iframe') {
                      router.push(url);
                    }
                  }}
                  className="title"
                >
                  {title}
                </div>
                <Icon type="close" className="icon" onClick={() => onClose(id)} />
              </div>
            ))}
          </div>
        }
        popupAlign={{
          points: ['tr', 'br'],
          offset: [5, 20],
        }}
        popupVisible={dropdownVisible}
        onPopupVisibleChange={this.handleDropdownVisibleChange}
        popupStyle={{ width: 'auto', position: 'absolute' }}
        prefixCls={styles['custom-tabs-more']}
        zIndex={100}
        mouseLeaveDelay={0.3}
        destroyPopupOnHide
      >
        <Icon type={dropdownVisible ? 'up' : 'down'} className="icon" />
      </Trigger>
    );
  };

  getShowTabItem = () => {
    const { data, activedKey } = this.props;
    let item = data[0];
    const activeIndex = data.findIndex(({ id }) => id === activedKey);
    if (activeIndex > -1) {
      item = data[activeIndex];
    }

    return item;
  };

  /** 根据页签模式获取页面 */
  getMenuNavItemByMode = showItem => {
    const { mode } = this.props;

    if (mode !== 'iframe') {
      return <Link to={showItem.url}>{showItem.title}</Link>;
    }

    return <a>{showItem.title}</a>;
  };

  getDropdonwnMenu = () => {
    const { menuContextAction = {}, data, actived } = this.props;

    return (
      <Menu
        onClick={({ key }) => {
          if (menuContextAction[key]) {
            menuContextAction[key](data[0]);
          }
        }}
      >
        {actived ? <Menu.Item key="closeOther">关闭其他</Menu.Item> : null}
        <Menu.Item key="closeAll">关闭所有</Menu.Item>
      </Menu>
    );
  };

  render() {
    const { data, width, onClick, closable, actived } = this.props;
    const isMore = data && data.length > 1;
    const showItem = this.getShowTabItem();

    return (
      <CSSTransition in appear timeout={100} unMountOnExit classNames={classNames('fade')}>
        <Dropdown overlay={this.getDropdonwnMenu()} trigger={['contextMenu']}>
          <div
            className={classNames({
              [styles['custom-tabs-item']]: true,
              [styles['custom-tabs-item_active']]: actived,
            })}
            title={showItem.title}
            onClick={() => onClick(showItem)}
            style={{ width }}
          >
            <div className="tab-top-line" />
            <div className="tab-title">{this.getMenuNavItemByMode(showItem)}</div>
            <div className="tab-operate-wrapper">
              {closable && !isMore && (
                <Icon
                  className="icon"
                  type="close"
                  onClick={e => this.handleClose(e, showItem.id, showItem.url)}
                />
              )}
              {isMore && this.getDropdownComponent()}
              {actived ? (
                <Fragment>
                  {/* <Icon
                    className="icon"
                    type="star"
                    onClick={e => this.handleCollect(e, showItem.id, showItem.url)}
                  /> */}
                  <Icon
                    className="icon"
                    type="sync"
                    onClick={e => this.handleRefresh(e, showItem.id, showItem.url)}
                  />
                </Fragment>
              ) : null}
            </div>
          </div>
        </Dropdown>
      </CSSTransition>
    );
  }
}
