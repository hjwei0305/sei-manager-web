import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
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
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem
            label="代码"
            style={{
              display: 'none',
            }}
          >
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              // rules: [{
              //   required: true,
              //   message: "代码不能为空"
              // }, {
              //   max: 10,
              //   message: "代码不能超过5个字符",
              // }]
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="名称">
            {getFieldDecorator('name', {
              initialValue: editData && editData.name,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: editData && editData.frozen,
            })(<Switch />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
