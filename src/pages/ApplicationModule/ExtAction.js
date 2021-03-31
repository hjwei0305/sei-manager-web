import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { isEqual, takeWhile } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './ExtAction.less';

const { getUUID, authAction } = utils;
const { APP_MODULE_ACTION } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '模块成员管理',
    key: APP_MODULE_ACTION.SZMKCY,
    disabled: !authAction(<span authCode="SZMKCY" />),
  },
  {
    title: '版本历史',
    key: APP_MODULE_ACTION.VERSION_HISTORY,
    disabled: false,
  },
  {
    title: 'ApiDoc',
    key: APP_MODULE_ACTION.VIEW_API_DOC,
    disabled: false,
  },
  {
    title: '派生二开',
    key: APP_MODULE_ACTION.SEC_DEV,
    disabled: !authAction(<span authCode="SEC_DEV" />),
  },
];

class ExtAction extends PureComponent {
  static confirmModal;

  static propTypes = {
    recordItem: PropTypes.object,
    onAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
      menusData: [],
    };
  }

  componentDidMount() {
    this.initActionMenus();
  }

  componentDidUpdate(prevProps) {
    const { recordItem } = this.props;
    if (!isEqual(prevProps.recordItem, recordItem)) {
      this.initActionMenus();
    }
  }

  initActionMenus = () => {
    const { recordItem } = this.props;
    const menus = menuData();
    const mData = takeWhile(
      menus.filter(m => !m.disabled),
      m => {
        if (
          !recordItem.nameSpace &&
          (m.key === APP_MODULE_ACTION.SEC_DEV || m.key === APP_MODULE_ACTION.VIEW_API_DOC)
        ) {
          return false;
        }
        return true;
      },
    );

    this.setState({
      menusData: mData,
    });
  };

  onActionOperation = e => {
    const { onAction, recordItem } = this.props;
    e.domEvent.stopPropagation();
    this.setState(
      {
        selectedKeys: '',
        menuShow: false,
      },
      () => {
        onAction(e.key, recordItem);
      },
    );
  };

  getMenu = (menus, recordItem) => {
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, recordItem)}
      >
        {menus.map(m => {
          return (
            <Item key={m.key}>
              <span className="menu-title">{m.title}</span>
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

  getRenderContent = () => {
    const { recordItem } = this.props;
    const { menuShow, menusData } = this.state;
    return (
      <>
        <Dropdown
          trigger={['click']}
          overlay={this.getMenu(menusData, recordItem)}
          className="action-drop-down"
          placement="bottomLeft"
          visible={menuShow}
          onVisibleChange={this.onVisibleChange}
        >
          <ExtIcon className={cls('action-recordItem')} type="more" antd />
        </Dropdown>
      </>
    );
  };

  render() {
    const { menusData } = this.state;
    return <>{menusData.length > 0 ? this.getRenderContent() : null}</>;
  }
}

export default ExtAction;
