import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  handlerFormSubmit = () => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, closeFormModal, saving, showTagModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showTagModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title="新建标签"
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="标签名称">
            {getFieldDecorator('tagName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '标签名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="标签消息">
            {getFieldDecorator('tagMessage', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '标签消息不能为空',
                },
              ],
            })(<TextArea style={{ resize: 'none' }} rows={3} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
