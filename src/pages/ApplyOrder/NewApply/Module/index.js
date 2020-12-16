import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { utils } from 'suid';
import FormModal from '../../Module/FormModal';
import styles from './index.less';

const { eventBus } = utils;

@connect(({ applyModule, loading }) => ({ applyModule, loading }))
class NewModule extends PureComponent {
  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: `applyModule/createSave`,
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
        }
      },
    });
  };

  saveToApprove = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyModule/saveToApprove',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
        }
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyModule/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
    eventBus.emit('closeTab', ['newModule']);
  };

  render() {
    const { applyModule, loading } = this.props;
    const { showModal, rowData, flowNodeData } = applyModule;
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      flowNodeData,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['applyModule/createSave'],
      saveToApprove: this.saveToApprove,
      saveToApproving: loading.effects['applyModule/saveToApprove'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        {showModal ? <FormModal {...formModalProps} /> : null}
      </div>
    );
  }
}

export default NewModule;
