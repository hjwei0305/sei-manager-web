import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { utils } from 'suid';
import FormModal from '../../Publish/FormModal';
import styles from './index.less';

const { eventBus } = utils;

@connect(({ applyPublish, loading }) => ({ applyPublish, loading }))
class NewPublish extends PureComponent {
  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: `applyPublish/createSave`,
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
      type: 'applyPublish/saveToApprove',
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
      type: 'applyPublish/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
    eventBus.emit('closeTab', ['publish']);
  };

  render() {
    const { applyPublish, loading } = this.props;
    const { showModal, rowData, versionTypeData, flowNodeData } = applyPublish;
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      versionTypeData,
      flowNodeData,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['applyPublish/createSave'],
      saveToApprove: this.saveToApprove,
      saveToApproving: loading.effects['applyPublish/saveToApprove'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        {showModal ? <FormModal {...formModalProps} /> : null}
      </div>
    );
  }
}

export default NewPublish;
