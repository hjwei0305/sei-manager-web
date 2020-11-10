import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { get } from 'lodash';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { Popconfirm, Tag, Descriptions } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import styles from './index.less';

class ServiceInterface extends Component {
  static listCardRef = null;

  static propTypes = {
    loading: PropTypes.bool,
    currentService: PropTypes.object,
    currentEnvViewType: PropTypes.object,
    instanceData: PropTypes.array,
    onDeleteInstance: PropTypes.func,
    instanceDeleting: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      delId: null,
    };
  }

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

  showLog = () => {};

  renderItemAction = item => {
    const { interfaceDeleting } = this.props;
    const { delId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <ExtIcon
            className={cls('action-item')}
            tooltip={{ title: '查看实时日志' }}
            type="history"
            antd
            onClick={() => this.showLog(item)}
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
      {item.payload.id}
      {item.enabled ? (
        <Tag color="blue" style={{ marginLeft: 8 }}>
          可用
        </Tag>
      ) : (
        <Tag color="red" style={{ marginLeft: 8 }}>
          不可用
        </Tag>
      )}
    </>
  );

  renderDescription = item => {
    const address = get(item, 'address', '');
    const port = get(item, 'port', '');
    const registTime = get(item, 'registrationTimeUTC', '');
    const id = get(item, 'id', '');
    return (
      <Descriptions column={2}>
        <Descriptions.Item label="实例地址">{address}</Descriptions.Item>
        <Descriptions.Item label="实例端口">{port}</Descriptions.Item>
        <Descriptions.Item label="注册ID">{id}</Descriptions.Item>
        <Descriptions.Item label="注册时间">
          {moment(registTime).format('YYYY-MM-DD hh:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  render() {
    const { loading, instanceData } = this.props;
    const configListProps = {
      className: 'left-content',
      showSearch: false,
      loading,
      showArrow: false,
      dataSource: instanceData,
      onListCardRef: ref => (this.listCardRef = ref),
      searchProperties: ['address', 'name'],
      itemField: {
        title: this.renderTitle,
        description: this.renderDescription,
      },
      itemTool: this.renderItemAction,
    };
    return (
      <div className={cls('config-box', styles['container-box'])}>
        <ListCard {...configListProps} />
      </div>
    );
  }
}

export default ServiceInterface;
