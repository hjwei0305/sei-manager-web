import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
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
  handlerFormSubmit = () => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改凭证' : '新建凭证';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={480}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="凭证名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '凭证名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="凭证的值">
            {getFieldDecorator('value', {
              initialValue: get(rowData, 'value'),
              rules: [
                {
                  required: true,
                  message: '凭证的值不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="凭证描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
