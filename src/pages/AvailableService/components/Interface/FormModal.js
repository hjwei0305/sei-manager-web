import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Switch } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class FormModal extends PureComponent {
  static propTypes = {
    save: PropTypes.func,
    formData: PropTypes.object,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    saving: PropTypes.bool,
  };

  handlerFormSubmit = () => {
    const { form, save, formData } = this.props;
    form.validateFields((err, frmData) => {
      if (err) {
        return;
      }
      const params = { ...formData };
      Object.assign(params, frmData);
      save(params);
    });
  };

  render() {
    const { form, formData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = formData ? '编辑接口' : '新建接口';
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
          <FormItem label="接口名称">
            {getFieldDecorator('name', {
              initialValue: get(formData, 'interfaceName'),
              rules: [
                {
                  required: true,
                  message: '接口名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="接口描述">
            {getFieldDecorator('interfaceRemark', {
              initialValue: get(formData, 'interfaceRemark'),
              rules: [
                {
                  required: true,
                  message: '接口描述不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="接口地址">
            {getFieldDecorator('interfaceURI', {
              initialValue: get(formData, 'interfaceURI'),
              rules: [
                {
                  required: true,
                  message: '接口地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="会话校检">
            {getFieldDecorator('validateToken', {
              initialValue: get(formData, 'validateToken', false),
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
