import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { ExtModal, BannerTitle } from 'suid';
import Assign from './Assign';
import styles from './index.less';

class ModuleUserModal extends PureComponent {
  static propTypes = {
    currentApp: PropTypes.object,
    showModal: PropTypes.bool,
    assignUser: PropTypes.func,
    assignLoading: PropTypes.bool,
    closeModal: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      accountSelected: null,
    };
  }

  componentDidUpdate(preProps) {
    const { showModal } = this.props;
    if (preProps.showModal !== showModal && showModal) {
      this.setState({ accountSelected: null });
    }
  }

  assignUser = () => {
    const { accountSelected } = this.state;
    const { assignUser, currentApp } = this.props;
    assignUser({ account: get(accountSelected, 'account'), appId: get(currentApp, 'id') });
  };

  userSelectChange = accountSelected => {
    this.setState({ accountSelected });
  };

  renderTitle = currentApp => {
    const title = get(currentApp, 'name', '');
    return <BannerTitle title={title} subTitle="候选人员列表" />;
  };

  renderFooterBtn = () => {
    const { accountSelected } = this.state;
    const { assignLoading, closeModal } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {accountSelected ? (
            <>
              <span>已选择：</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{`${get(
                accountSelected,
                'nickname',
              )}(${get(accountSelected, 'account')})`}</span>
            </>
          ) : null}
        </div>
        <div>
          <Button disabled={assignLoading} onClick={closeModal}>
            取消
          </Button>
          <Button
            disabled={!accountSelected}
            loading={assignLoading}
            onClick={() => this.assignUser(true)}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { currentApp, showModal, closeModal } = this.props;
    const extModalProps = {
      maskClosable: false,
      destroyOnClose: true,
      onCancel: closeModal,
      wrapClassName: cls(styles['assign-modal-box']),
      visible: showModal,
      centered: true,
      width: 520,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      title: this.renderTitle(currentApp),
      footer: this.renderFooterBtn(),
    };
    const assignProps = {
      userSelectChange: this.userSelectChange,
    };
    return (
      <ExtModal {...extModalProps}>
        <Assign {...assignProps} />
      </ExtModal>
    );
  }
}

export default ModuleUserModal;
