import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Popconfirm, Tag, Button } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import FormModal from './FormModal';
import styles from './index.less';

const { Search } = Input;

class ServiceInterface extends Component {
  static listCardRef = null;

  static propTypes = {
    loading: PropTypes.bool,
    currentService: PropTypes.object,
    currentEnvViewType: PropTypes.object,
    interfaceData: PropTypes.array,
    onSaveInterface: PropTypes.func,
    interfaceSaving: PropTypes.bool,
    onDeleteInterface: PropTypes.func,
    interfaceDeleting: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      delId: null,
      showModal: false,
      formData: null,
    };
  }

  handlerSaveInterface = data => {
    const { onSaveInterface } = this.props;
    if (onSaveInterface) {
      onSaveInterface(data);
    }
  };

  handlerDeleteInterface = (item, e) => {
    const { onDeleteInterface } = this.props;
    if (onDeleteInterface) {
      onDeleteInterface(item, e);
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

  add = () => {
    this.setState({ showModal: true, formData: null });
  };

  edit = formData => {
    this.setState({ showModal: true, formData });
  };

  closeFormModal = () => {
    this.setState({ showModal: false, formData: null });
  };

  renderCustomTool = () => {
    return (
      <>
        <Button onClick={this.add} type="primary">
          新建
        </Button>
        <Search
          allowClear
          placeholder="输入名称、说明或地址关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 280 }}
        />
      </>
    );
  };

  renderItemAction = item => {
    const { interfaceDeleting } = this.props;
    const { delId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <ExtIcon
            className={cls('action-item')}
            type="edit"
            antd
            onClick={() => this.edit(item)}
          />
          <Popconfirm
            title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗?' })}
            onConfirm={e => this.handlerDeleteInterface(item, e)}
          >
            {interfaceDeleting && delId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  renderTitle = item => (
    <>
      {item.interfaceName}
      <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.interfaceURI}</span>
    </>
  );

  renderAvatar = ({ item }) => {
    if (item.validateToken === false) {
      return <Tag color="volcano">不校验</Tag>;
    }
    if (item.validateToken === true) {
      return <Tag>需校验</Tag>;
    }
  };

  render() {
    const { formData, showModal } = this.state;
    const { loading, interfaceData, onSaveInterface, interfaceSaving } = this.props;
    const configListProps = {
      className: 'left-content',
      showSearch: false,
      loading,
      showArrow: false,
      dataSource: interfaceData,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['interfaceName', 'interfaceURI', 'interfaceRemark'],
      itemField: {
        avatar: this.renderAvatar,
        title: this.renderTitle,
        description: item => item.interfaceRemark,
      },
      itemTool: this.renderItemAction,
    };
    const formModalProps = {
      save: onSaveInterface,
      formData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: interfaceSaving,
    };
    return (
      <div className={cls('config-box', styles['container-box'])}>
        <ListCard {...configListProps} />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default ServiceInterface;
