import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { utils } from 'suid';
import FormModal from '../../Application/FormModal';
import styles from './index.less';

const { eventBus } = utils;

@connect(({ applyApplication, loading }) => ({ applyApplication, loading }))
class NewApplication extends PureComponent {
  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: `applyApplication/createSave`,
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
      type: 'applyApplication/saveToApprove',
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
      type: 'applyApplication/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
    eventBus.emit('closeTab', ['newApp']);
  };

  render() {
    const { applyApplication, loading } = this.props;
    const { showModal, rowData, flowNodeData } = applyApplication;
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      flowNodeData,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['applyApplication/createSave'],
      saveToApprove: this.saveToApprove,
      saveToApproving: loading.effects['applyApplication/saveToApprove'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        {showModal ? <FormModal {...formModalProps} /> : null}
      </div>
    );
  }
}

export default NewApplication;
