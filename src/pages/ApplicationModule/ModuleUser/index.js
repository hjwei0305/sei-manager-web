import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { ExtModal, ExtIcon, BannerTitle } from 'suid';
import Assign from './Assign';
import Assinged from './Assigned';
import styles from './index.less';

class ModuleUserModal extends PureComponent {
  static propTypes = {
    currentModule: PropTypes.object,
    showModal: PropTypes.bool,
    assignUsers: PropTypes.func,
    removeUsers: PropTypes.func,
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

  assignUsers = (keys, callback) => {
    const { assignUsers } = this.props;
    assignUsers(keys, callback);
  };

  removeUsers = (keys, callback) => {
    const { removeUsers } = this.props;
    removeUsers(keys, callback);
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
    setTimeout(this.handlerBackAssigned, 100);
  };

  renderTitle = currentModule => {
    const { showAssign } = this.state;
    const title = get(currentModule, 'name', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle="请选择要添加的人员" />
        </>
      );
    }
    return <BannerTitle title={title} subTitle="模块成员" />;
  };

  render() {
    const { currentModule, showModal, assignLoading, removeAssignedLoading } = this.props;
    const { showAssign } = this.state;
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['assign-modal-box'], showAssign ? styles['assign-to-box'] : null),
      keyboard: !showAssign,
      visible: showModal,
      centered: true,
      width: 520,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(currentModule),
    };
    const assignProps = {
      currentModule,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignUsers,
      saving: assignLoading,
    };
    const assignedProps = {
      currentModule,
      onShowAssign: this.handlerShowAssign,
      save: this.removeUsers,
      saving: removeAssignedLoading,
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default ModuleUserModal;
