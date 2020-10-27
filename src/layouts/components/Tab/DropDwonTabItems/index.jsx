import React, { Component } from 'react';
import { Icon } from 'antd';
import { ExtIcon } from 'suid';
import { router } from 'umi';
import cls from 'classnames';
import Trigger from 'rc-trigger';
import PropTypes from 'prop-types';
import styles from './index.less';

class DropdownTabItems extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  state = {
    visible: false,
  };

  handleClick = () => {
    this.setState({ visible: false });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  getDropdownComponent = () => {
    const { data, onClick, onClose, activedKey, mode } = this.props;
    const { visible } = this.state;
    const dropdownData = [...data];

    return (
      <Trigger
        action={['click']}
        popup={
          <div className="tabs-more-wrap" onClick={this.handleClick}>
            {dropdownData.map(({ title, url, id, noClosable }) => (
              <div
                key={id}
                className={cls({
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
                {!noClosable ? (
                  <Icon type="close" className="icon" onClick={() => onClose(id)} />
                ) : null}
              </div>
            ))}
          </div>
        }
        popupAlign={{
          points: ['tr', 'br'],
          offset: [5, 20],
        }}
        popupVisible={visible}
        onPopupVisibleChange={this.handleVisibleChange}
        popupStyle={{ width: 'auto', position: 'absolute' }}
        prefixCls={styles['custom-tabs-more']}
        zIndex={100}
        mouseLeaveDelay={0.3}
        destroyPopupOnHide
      >
        <ExtIcon
          tooltip={{ title: '所有页签' }}
          type={visible ? 'up' : 'down'}
          className="icon"
          antd
        />
      </Trigger>
    );
  };

  render() {
    // const { onCloseCurrent, onCloseAll, onReloadCurrent, } = this.props;
    // const { visible } = this.state;
    return (
      <div className={cls(styles['drop-tabs-items'], 'trigger')}>{this.getDropdownComponent()}</div>
    );
  }
}

export default DropdownTabItems;
