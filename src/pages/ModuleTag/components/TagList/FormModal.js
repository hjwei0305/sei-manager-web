import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Alert } from 'antd';
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
    const { form, save, currentModule } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = { gitId: get(currentModule, 'gitId') };
      Object.assign(params, formData);
      save(params);
    });
  };

  validateName = (rule, value, callback) => {
    const reg = /^[1-9]\d{0,1}?(\.(0|[1-9]\d?))(\.(0{0,2}|[1-9]\d?){1,3})$/;
    if (value && !reg.test(value)) {
      callback('标签名称格式不正确!');
    }
    callback();
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
        bodyStyle={{ padding: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title="新建标签"
      >
        <Alert message="提示:请合并代码到 master 分支后，再创建标签!" banner />
        <Form {...formItemLayout} layout="horizontal" style={{ padding: 24 }}>
          <FormItem label="标签名称">
            {getFieldDecorator('tagName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '标签名称不能为空',
                },
                {
                  validator: this.validateName,
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="标签描述">
            {getFieldDecorator('message', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '标签描述不能为空',
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
