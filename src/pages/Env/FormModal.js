import React, { PureComponent } from 'react';
import { get } from 'lodash';
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
    const title = rowData ? '修改环境' : '新建环境';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="环境代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '环境代码不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="环境名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '环境名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="环境描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
            })(<Input />)}
          </FormItem>
          <FormItem label="代理服务基地址">
            {getFieldDecorator('agentServer', {
              initialValue: get(rowData, 'agentServer'),
              rules: [
                {
                  required: true,
                  message: '代理服务基地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: get(rowData, 'frozen', false),
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
