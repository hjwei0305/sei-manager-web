import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { utils } from 'suid';
import FormModal from '../../Deploy/FormModal';
import styles from './index.less';

const { eventBus } = utils;

@connect(({ applyDeploy, loading }) => ({ applyDeploy, loading }))
class NewDeploy extends PureComponent {
  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: `applyDeploy/createSave`,
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
      type: 'applyDeploy/saveToApprove',
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
      type: 'applyDeploy/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
    eventBus.emit('closeTab', ['deploy']);
  };

  getTagContent = tagId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applyDeploy/getTag',
      payload: {
        id: tagId,
      },
    });
  };

  render() {
    const { applyDeploy, loading } = this.props;
    const { showModal, rowData, tagContent } = applyDeploy;
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['applyDeploy/createSave'],
      saveToApprove: this.saveToApprove,
      saveToApproving: loading.effects['applyDeploy/saveToApprove'],
      tagContent,
      getTagContent: this.getTagContent,
      loadingTagContent: loading.effects['applyDeploy/getTag'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        {showModal ? <FormModal {...formModalProps} /> : null}
      </div>
    );
  }
}

export default NewDeploy;
