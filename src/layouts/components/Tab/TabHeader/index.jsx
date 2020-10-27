import React, { Component } from 'react';
import propTypes from 'prop-types';
import { debounce } from 'lodash';
import { message } from 'suid';
import { router } from 'umi';
import ResizeObserver from 'rc-resize-observer';
import DropDwonTabItems from '../DropDwonTabItems';
import TabItem from '../TabItem/index.jsx';
import styles from './index.less';

class Tabs extends Component {
  /** 页签的默认宽度 */
  static tabItemWidth = 106;

  /** 第一个页签的宽度 */
  static firstWidth = 106;

  static propTypes = {
    /** tab 页签数据 */
    data: propTypes.arrayOf(
      propTypes.shape({
        /** 页签id */
        id: propTypes.string,
        /** 页签名称 */
        title: propTypes.string,
        /** 页签url地址 */
        url: propTypes.string,
      }),
    ).isRequired,
    /** 被激活的页签键值 */
    activedKey: propTypes.string.isRequired,
    /** 页签关闭时的回调函数 */
    onClose: propTypes.func.isRequired,
    /** 切换页签时的回调函数 */
    onChange: propTypes.func.isRequired,
    /** 重新加载该页签 */
    onReload: propTypes.func.isRequired,
    /** 页签打开模式 */
    mode: propTypes.string,
  };

  static defaultProps = {
    mode: 'iframe',
  };

  static showStartIndex = 0;

  componentDidMount() {
    this.computeShowCount();
  }

  /** 根据实际宽度计算可以显示的页签个数 */
  computeShowCount = () => {
    const { onResize } = this.props;
    // const containerWidth = this.refContainer.offsetWidth;
    const containerWidth = this.parentWidth || 0;
    const tabsWidth = containerWidth - 60 - (this.firstWidth + 4);
    const showCount = Math.floor(tabsWidth / (this.tabItemWidth + 4)) + 1;
    if (onResize) {
      onResize(showCount);
    }
  };

  /* eslint-disable */
  /** 防抖计算可以显示的页签个数 */
  handleResize = debounce(this.computeShowCount, 300);

  /** 关闭当前激活的页签 */
  handleCloseCurrent = () => {
    const { visibleTabData: data, onChange, activedKey, onClose, mode } = this.props;
    if (data.length >= 1) {
      const i = data.findIndex(({ id }) => id === activedKey);
      const currActivedMenu = data[i];
      if (currActivedMenu.noClosable) {
        message.warn('当前页签不可关闭');
      } else {
        let activingItem = null;
        if (i === 0 && data.length > 1) {
          activingItem = data[i + 1];
        } else {
          activingItem = data[i - 1];
        }
        if (activingItem) {
          // onChange(activingItem.id, activingItem);
          /** 安全考虑，防止复制地址，访问没有权限的地址，切换页签的时候禁止地址变化 */
          if (mode !== 'iframe') {
            /** 导航  */
            router.push(activingItem.url);
          }
        }
        onClose([activedKey], data.length === 1);
      }
    }
  };

  /** 关闭所有页签 */
  handleCloseAll = () => {
    const { onClose, visibleTabData, moreTabData } = this.props;
    const data = visibleTabData.concat(moreTabData);
    if (data.length >= 1) {
      onClose(
        data.filter(item => !item.noClosable).map(({ id }) => id),
        true,
      );
    }
  };

  /** 根据id关闭页签 */
  handleClose = id => {
    const { activedKey, onClose, visibleTabData: data } = this.props;
    if (activedKey === id) {
      this.handleCloseCurrent();
    } else {
      onClose([id], data.length === 1);
    }
  };

  handleClick = menus => {
    const { activedKey, onChange } = this.props;
    const { id } = menus;
    if (activedKey !== id) {
      onChange(menus.id, menus);
    }
  };

  handleReload = () => {
    const { onReload, activedKey } = this.props;
    onReload(activedKey);
  };

  handleCloseOther = () => {
    const { onClose, visibleTabData, moreTabData, activedKey } = this.props;
    const data = visibleTabData.concat(moreTabData);
    if (onClose) {
      onClose(
        data
          .filter(item => !item.noClosable)
          .map(item => item.id)
          .filter(id => id !== activedKey),
        false,
      );
    }
  };

  renderTabItem = (data, index) => {
    const { activedKey, mode } = this.props;

    let actived = false;
    if (!data) {
      return null;
    }

    if (data.findIndex(({ id }) => id === activedKey) > -1) {
      actived = true;
    }

    return (
      <TabItem
        width={index === 0 ? this.firstWidth : this.tabItemWidth}
        data={data}
        key={data[0].id}
        onClose={this.handleClose}
        onClick={this.handleClick}
        closable={!data[0].noClosable}
        activedKey={activedKey}
        actived={actived}
        mode={mode}
        menuContextAction={{
          reload: this.handleReload,
          closeOther: this.handleCloseOther,
          closeAll: this.handleCloseAll,
        }}
      />
    );
  };

  renderTabItems = () => {
    const { data, visibleTabData = [] } = this.props;

    return [...visibleTabData.map((tab, index) => this.renderTabItem([tab], index, data.length))];
  };

  render() {
    const { data, activedKey, mode, moreTabData, visibleTabData, showTabCounts = 0 } = this.props;

    return (
      <ResizeObserver
        onResize={param => {
          this.parentWidth = param.offsetWidth;
          this.handleResize();
        }}
      >
        <div
          className={styles['custom-tabs']}
          ref={ref => {
            this.refContainer = ref;
          }}
        >
          <div
            style={{
              width: showTabCounts * (this.tabItemWidth + 4),
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              height: 56,
            }}
          >
            <div style={{ width: visibleTabData.length * (this.tabItemWidth + 4) }}>
              {this.renderTabItems()}
            </div>
          </div>
          {moreTabData.length ? (
            <DropDwonTabItems
              onClose={this.handleClose}
              onClick={this.handleClick}
              activedKey={activedKey}
              mode={mode}
              data={moreTabData || []}
            />
          ) : null}
        </div>
      </ResizeObserver>
    );
  }
}

export default Tabs;
