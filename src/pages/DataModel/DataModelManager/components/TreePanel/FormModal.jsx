import React, { PureComponent } from 'react';
import { ExtModal } from 'suid';
import FormItem from './FormItem';

class FormModal extends PureComponent {
  render() {
    const { visible, onCancel, editData, parentData, saving } = this.props;
    let title = '编辑';
    if (!parentData && !editData) {
      title = '新建根结点';
    }

    if (parentData && !editData) {
      title = '新建子结点';
    }

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        confirmLoading={saving}
        title={title}
        onOk={() => {
          this.formRef.onFormSubmit();
        }}
      >
        <FormItem
          onRef={inst => (this.formRef = inst)}
          editData={editData}
          parentData={parentData}
        />
      </ExtModal>
    );
  }
}

export default FormModal;
