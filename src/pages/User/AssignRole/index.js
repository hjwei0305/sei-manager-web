import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { ExtModal, ExtIcon, BannerTitle } from 'suid';
import Assign from './Assign';
import Assinged from './Assigned';
import styles from './index.less';

class UserRoleModal extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object,
    showModal: PropTypes.bool,
    assignRoles: PropTypes.func,
    removeAssignedRoles: PropTypes.func,
    assignLoading: PropTypes.bool,
    removeAssignedLoading: PropTypes.bool,
    closeModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignRoles = (keys, callback) => {
    const { assignRoles } = this.props;
    assignRoles(keys, callback);
  };

  removeAssignedRoles = (keys, callback) => {
    const { removeAssignedRoles } = this.props;
    removeAssignedRoles(keys, callback);
  };

  handlerShowAssign = () => {
    this.setState({ showAssign: true });
  };

  handlerBackAssigned = () => {
    this.setState({ showAssign: false });
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  renderTitle = currentUser => {
    const { showAssign } = this.state;
    const title = get(currentUser, 'nickname', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle="请选择要添加的角色" />
        </>
      );
    }
    return <BannerTitle title={title} subTitle="已配置的角色" />;
  };

  render() {
    const { currentUser, showModal, assignLoading, removeAssignedLoading } = this.props;
    const { showAssign } = this.state;
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['assign-modal-box'], showAssign ? styles['assign-to-box'] : null),
      closable: !showAssign,
      keyboard: !showAssign,
      visible: showModal,
      centered: true,
      width: 480,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(currentUser),
    };
    const assignProps = {
      currentUser,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignRoles,
      saving: assignLoading,
    };
    const assignedProps = {
      currentUser,
      onShowAssign: this.handlerShowAssign,
      save: this.removeAssignedRoles,
      saving: removeAssignedLoading,
      onSaveEffectDate: this.handlerSaveEffectDate,
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default UserRoleModal;
