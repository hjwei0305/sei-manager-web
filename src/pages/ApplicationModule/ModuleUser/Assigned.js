import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Drawer, Popconfirm, Input } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import styles from './Assigned.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class FeatureRoleAssigned extends PureComponent {
  static listCardRef;

  static propTypes = {
    currentModule: PropTypes.object,
    onShowAssign: PropTypes.func,
    saving: PropTypes.bool,
    save: PropTypes.func,
  };

  static defaultProps = {
    currentModule: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      removeId: '',
    };
  }

  handerAssignedSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerShowAssign = () => {
    const { onShowAssign } = this.props;
    if (onShowAssign) {
      onShowAssign();
    }
  };

  batchRemoveAssigned = () => {
    const { selectedKeys } = this.state;
    const { save } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ selectedKeys: [] });
        }
      });
    }
  };

  removeAssigned = (item, e) => {
    e.stopPropagation();
    const { save } = this.props;
    if (save) {
      const selectedKeys = [item.account];
      this.setState({
        removeId: item.account,
      });
      save(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ removeId: '', selectedKeys: [] });
        }
      });
    }
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedKeys: [],
    });
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

  renderCustomTool = ({ total }) => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
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
            <Button onClick={this.onCancelBatchRemoveAssigned} disabled={saving}>
              取消
            </Button>
            <Popconfirm title="确定要移除选择的成员吗？" onConfirm={this.batchRemoveAssigned}>
              <Button type="danger" loading={saving}>
                移除
              </Button>
            </Popconfirm>
            <span className={cls('select')}>{`已选择 ${selectedKeys.length} 项`}</span>
          </Drawer>
        ) : (
          <>
            <span>
              {`${total} 位成员`}
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handlerShowAssign}>
                添加成员
              </Button>
            </span>
            <Search
              allowClear
              placeholder="输入姓名或账号关键字查询"
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerPressEnter}
              style={{ width: 220 }}
            />
          </>
        )}
      </>
    );
  };

  renderItemAction = item => {
    const { saving } = this.props;
    const { removeId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <Popconfirm title="确定要移除吗?" onConfirm={e => this.removeAssigned(item, e)}>
            {saving && removeId === item.gitUserId ? (
              <ExtIcon className={cls('del', 'action-item', 'loading')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="minus-circle" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  render() {
    const { currentModule } = this.props;
    const { selectedKeys } = this.state;
    const moduleId = get(currentModule, 'id', null);
    const assignedListCardProps = {
      className: 'station-box',
      bordered: false,
      checkbox: true,
      selectedKeys,
      rowKey: 'account',
      itemField: {
        title: item => item.userName,
        description: item => item.account,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/projectUser/getAssignedUser`,
        params: {
          objectId: moduleId,
        },
      },
      showArrow: false,
      showSearch: false,
      onListCardRef: ref => (this.listCardRef = ref),
      itemTool: this.renderItemAction,
      customTool: this.renderCustomTool,
      onSelectChange: this.handerAssignedSelectChange,
    };
    return (
      <div className={cls(styles['assigned-box'])}>
        {moduleId && <ListCard {...assignedListCardProps} />}
      </div>
    );
  }
}

export default FeatureRoleAssigned;
