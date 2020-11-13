import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import Assigned from './Assigned';
import Assign from './Assign';
import styles from './index.less';

@connect(({ featureRole, loading }) => ({
  featureRole,
  loading,
}))
class UserModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignUser = (keys, callback) => {
    const { rowData, dispatch } = this.props;
    const data = { childId: get(rowData, 'id', null), parentIds: keys };
    dispatch({
      type: 'featureRole/assignUser',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unassignUser = (keys, callback) => {
    const { rowData, dispatch } = this.props;
    const data = { childId: get(rowData, 'id', null), parentIds: keys };
    dispatch({
      type: 'featureRole/unAssignUser',
      payload: {
        ...data,
      },
      callback,
    });
  };

  handlerShowAssign = () => {
    this.setState({ showAssign: true });
  };

  handlerBackAssigned = () => {
    this.setState({ showAssign: false });
  };

  renderTitle = role => {
    const { showAssign } = this.state;
    const title = get(role, 'name', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle="请选择要添加的用户" />
        </>
      );
    }
    return <BannerTitle title={title} subTitle="已配置的用户" />;
  };

  render() {
    const { rowData, closeFormModal, showModal, loading } = this.props;
    const { showAssign } = this.state;
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: closeFormModal,
      wrapClassName: cls(styles['assign-modal-box'], showAssign ? styles['assign-to-box'] : null),
      closable: !showAssign,
      keyboard: !showAssign,
      visible: showModal,
      centered: true,
      width: 480,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(rowData),
    };
    const assignProps = {
      currentRole: rowData,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignUser,
      saving: loading.effects['featureRole/assignUser'],
      extParams: { excludeFeatureRoleId: get(rowData, 'id', null) },
    };
    const assignedProps = {
      currentRole: rowData,
      onShowAssign: this.handlerShowAssign,
      save: this.unassignUser,
      saving: loading.effects['featureRole/unAssignUser'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assigned {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default UserModal;
