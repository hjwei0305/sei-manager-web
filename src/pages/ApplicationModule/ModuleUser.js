import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Input } from 'antd';
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
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
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

  renderCustomTool = ({ total }) => (
    <>
      {`共有 ${total} 位成员`}
      <Search
        allowClear
        placeholder="输入成员姓名关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: 200 }}
      />
    </>
  );

  render() {
    const { currentModule, showModal } = this.props;
    const extModalProps = {
      destroyOnClose: true,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['user-modal-box ']),
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
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.name,
        description: item => item.description,
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/userRole/getChildrenFromParentId`,
        params: {
          moduleCode: get(currentModule, 'code'),
        },
      },
      showArrow: false,
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
