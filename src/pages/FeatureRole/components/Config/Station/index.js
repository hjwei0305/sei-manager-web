import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { StationAssign, BannerTitle } from '@/components';
import Assinged from './Assigned';
import styles from './index.less';

@connect(({ featureRole, loading }) => ({
  featureRole,
  loading,
}))
class StationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignStation = (keys, callback) => {
    const { rowData, dispatch } = this.props;
    const data = { childId: get(rowData, 'id', null), parentIds: keys };
    dispatch({
      type: 'featureRole/assignStation',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unassignStation = (keys, callback) => {
    const { rowData, dispatch } = this.props;
    const data = { childId: get(rowData, 'id', null), parentIds: keys };
    dispatch({
      type: 'featureRole/unAssignStation',
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
          <BannerTitle title={title} subTitle="请选择要添加的岗位" />
        </>
      );
    }
    return <BannerTitle title={title} subTitle="已配置的岗位" />;
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
      width: 680,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(rowData),
    };
    const assignProps = {
      currentRole: rowData,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignStation,
      saving: loading.effects['featureRole/assignStation'],
      extParams: { excludeFeatureRoleId: get(rowData, 'id', null) },
    };
    const assignedProps = {
      currentRole: rowData,
      onShowAssign: this.handlerShowAssign,
      save: this.unassignStation,
      saving: loading.effects['featureRole/unAssignStation'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <StationAssign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default StationModal;
