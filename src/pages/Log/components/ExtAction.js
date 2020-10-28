import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon, WorkFlow, message } from 'suid';
import { constants } from '@/utils';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { StartFlow, FlowHistoryButton } = WorkFlow;
const { PAY_BILL_ACTION, PAY_BILL_DOCUMENT_STATUS } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '查看详情',
    key: PAY_BILL_ACTION.VIEW,
    disabled: false,
  },
  {
    title: '编辑申请',
    key: PAY_BILL_ACTION.EDIT,
    disabled: false,
  },
  {
    title: '删除申请',
    key: PAY_BILL_ACTION.DELETE,
    disabled: false,
  },
  {
    title: '流程历史',
    key: PAY_BILL_ACTION.FLOW_HISTORY,
    disabled: false,
  },
  {
    title: '支付异常处理',
    key: PAY_BILL_ACTION.HANDLE_EXCEPTION,
    disabled: true,
  },
  {
    title: formatMessage({ id: 'global.startFlow', defaultMessage: '提交审批' }),
    key: PAY_BILL_ACTION.START_FLOW,
    disabled: false,
  },
  {
    title: '支付回送',
    key: PAY_BILL_ACTION.PAYMENT_SEND_BACK,
    disabled: true,
  },
];

class ExtAction extends PureComponent {
  static globalLoad;

  static propTypes = {
    recordItem: PropTypes.object,
    currentViewType: PropTypes.object,
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
    const { currentViewType, recordItem } = this.props;
    if (!isEqual(prevProps.currentViewType, currentViewType)) {
      this.initActionMenus();
    }
    if (!isEqual(prevProps.recordItem, recordItem)) {
      this.initActionMenus();
    }
  }

  initActionMenus = () => {
    const { recordItem } = this.props;
    const menus = menuData();
    if (
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.INPROCESS.name ||
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.COMPLETED.name ||
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.PAYMENT_PROCESSING.name ||
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.PAYMENT_ERROR.name ||
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.PAYMENT_COMPLETED.name ||
      recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.CLOSED.name
    ) {
      menus.forEach(m => {
        if (
          m.key === PAY_BILL_ACTION.EDIT ||
          m.key === PAY_BILL_ACTION.DELETE ||
          m.key === PAY_BILL_ACTION.START_FLOW
        ) {
          Object.assign(m, { disabled: true });
        }
      });
    }
    if (recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.INIT.name) {
      menus.forEach(m => {
        if (m.key === PAY_BILL_ACTION.FLOW_HISTORY) {
          Object.assign(m, { disabled: true });
        }
        if (!recordItem.deleteAllowed && m.key === PAY_BILL_ACTION.DELETE) {
          Object.assign(m, { disabled: true });
        }
      });
    }
    if (recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.PAYMENT_ERROR.name) {
      menus.forEach(m => {
        if (m.key === PAY_BILL_ACTION.HANDLE_EXCEPTION) {
          Object.assign(m, { disabled: false });
        }
      });
    }
    if (
      recordItem.returnTag === false &&
      (recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.PAYMENT_COMPLETED.name ||
        recordItem.documentStatus === PAY_BILL_DOCUMENT_STATUS.CLOSED.name)
    ) {
      menus.forEach(m => {
        if (m.key === PAY_BILL_ACTION.PAYMENT_SEND_BACK) {
          Object.assign(m, { disabled: false });
        }
      });
    }
    const mData = menus.filter(m => !m.disabled);
    this.setState({
      menusData: mData,
    });
  };

  handlerBeforeStart = () => {
    return new Promise(resolve => {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      this.globalLoad = message.loading('正在提交...', 0);
      resolve({ success: true });
    });
  };

  startComplete = res => {
    const { onAction, recordItem } = this.props;
    if (res.success) {
      message.destroy();
      const key = PAY_BILL_ACTION.START_FLOW;
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      onAction(key, recordItem);
    }
  };

  onActionOperation = e => {
    const { onAction, recordItem } = this.props;
    e.domEvent.stopPropagation();
    if (e.key === PAY_BILL_ACTION.START_FLOW) {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
    } else {
      this.setState(
        {
          selectedKeys: '',
          menuShow: false,
        },
        () => {
          onAction(e.key, recordItem);
        },
      );
    }
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
          if (m.key === PAY_BILL_ACTION.START_FLOW) {
            return (
              <Item key={m.key}>
                <StartFlow
                  key={recordItem.id}
                  businessKey={recordItem.id}
                  businessModelCode="com.changhong.bms.entity.payable.BmsPaymentRequestHead"
                  beforeStart={this.handlerBeforeStart}
                  startComplete={this.startComplete}
                >
                  {loading => {
                    if (!loading && this.globalLoad) {
                      this.globalLoad();
                    }
                    return (
                      <div style={{ height: '100%' }}>
                        <span className="menu-title">{m.title}</span>
                      </div>
                    );
                  }}
                </StartFlow>
              </Item>
            );
          }
          if (m.key === PAY_BILL_ACTION.FLOW_HISTORY) {
            return (
              <Item key={m.key}>
                <FlowHistoryButton key={m.key} businessId={recordItem.id}>
                  <div style={{ height: '100%' }}>
                    <span className="menu-title">{m.title}</span>
                  </div>
                </FlowHistoryButton>
              </Item>
            );
          }
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
