import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { APPLY_APPLICATION_ACTION, APPLY_STATUS } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '查看详情',
    key: APPLY_APPLICATION_ACTION.VIEW,
    disabled: false,
  },
  {
    title: '编辑申请',
    key: APPLY_APPLICATION_ACTION.EDIT,
    disabled: false,
  },
  {
    title: '删除申请',
    key: APPLY_APPLICATION_ACTION.DELETE,
    disabled: false,
  },
  {
    title: '提交审核',
    key: APPLY_APPLICATION_ACTION.APPROVE,
    disabled: false,
  },
  {
    title: '终止审核',
    key: APPLY_APPLICATION_ACTION.STOP_APPROVE,
    disabled: true,
  },
];

class ExtAction extends PureComponent {
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
    if (
      recordItem.approvalStatus === APPLY_STATUS.PROCESSING.name ||
      recordItem.approvalStatus === APPLY_STATUS.PASSED.name
    ) {
      menus.forEach(m => {
        if (
          m.key === APPLY_APPLICATION_ACTION.EDIT ||
          m.key === APPLY_APPLICATION_ACTION.DELETE ||
          m.key === APPLY_APPLICATION_ACTION.APPROVE
        ) {
          Object.assign(m, { disabled: true });
        }
        if (
          recordItem.approvalStatus === APPLY_STATUS.PROCESSING.name &&
          m.key === APPLY_APPLICATION_ACTION.STOP_APPROVE
        ) {
          Object.assign(m, { disabled: false });
        }
      });
    }
    const mData = menus.filter(m => !m.disabled);
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
