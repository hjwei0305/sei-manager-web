import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Input, Drawer, Button, Popconfirm } from 'antd';
import { ExtModal, BannerTitle, ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { Search } = Input;
const { SERVER_PATH } = constants;

class ModuleUser extends PureComponent {
  static listCardRef;

  static propTypes = {
    currentModule: PropTypes.object,
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
    removeUser: PropTypes.func,
    removing: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  handerAssignedSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  batchRemoveAssigned = () => {
    const { selectedKeys } = this.state;
    const { removeUser } = this.props;
    if (removeUser) {
      removeUser(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ selectedKeys: [] });
        }
      });
    }
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedKeys: [],
    });
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      this.setState(
        {
          selectedKeys: [],
        },
        closeModal,
      );
    }
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderTitle = currentModule => {
    return <BannerTitle title={get(currentModule, 'name')} subTitle="模块成员" />;
  };

  renderCustomTool = ({ total }) => {
    const { selectedKeys } = this.state;
    const { removing } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        {hasSelected ? (
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={hasSelected}
          >
            <Button onClick={this.onCancelBatchRemoveAssigned} disabled={removing}>
              取消
            </Button>
            <Popconfirm title="确定要移除选择的模块成员吗？" onConfirm={this.batchRemoveAssigned}>
              <Button type="danger" loading={removing}>
                {`移除 (${selectedKeys.length})`}
              </Button>
            </Popconfirm>
          </Drawer>
        ) : (
          <>
            {`共有 ${total} 位成员`}
            <Search
              allowClear
              placeholder="输入姓名或账号关键字查询"
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerPressEnter}
              style={{ width: 240 }}
            />
          </>
        )}
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { currentModule, showModal } = this.props;
    const extModalProps = {
      destroyOnClose: true,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['user-modal-box']),
      visible: showModal,
      centered: true,
      width: 480,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(currentModule),
    };
    const listCardProps = {
      bordered: false,
      showSearch: false,
      checkbox: true,
      selectedKeys,
      rowKey: 'gitUserId',
      searchProperties: ['name', 'account'],
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.name,
        description: item => item.account,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/appModule/getModuleUsers`,
        params: {
          id: get(currentModule, 'id'),
        },
      },
      showArrow: false,
      onSelectChange: this.handerAssignedSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <ExtModal {...extModalProps}>
        <ListCard {...listCardProps} />
      </ExtModal>
    );
  }
}

export default ModuleUser;
