import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Switch } from 'antd';
import { ExtModal, BannerTitle } from 'suid';

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
    rowData: PropTypes.object,
    editSave: PropTypes.func,
    createdSave: PropTypes.func,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    editSaving: PropTypes.bool,
    createdSaving: PropTypes.bool,
  };

  handlerFormSubmit = () => {
    const { form, editSave, createdSave, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      if (formData.status) {
        Object.assign(params, { status: -1 });
      } else {
        Object.assign(params, { status: 0 });
      }
      if (params.id) {
        editSave(params);
      } else {
        createdSave(params);
      }
    });
  };

  validatePhone = (rule, value, callback) => {
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (value && !reg.test(value)) {
      callback('手机号格式不正确');
    }
    callback();
  };

  render() {
    const { form, rowData, closeFormModal, editSaving, createdSaving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改' : '新建';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={editSaving || createdSaving}
        title={<BannerTitle title={title} subTitle="用户" />}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="账号">
            {getFieldDecorator('account', {
              initialValue: get(rowData, 'account'),
              rules: [
                {
                  required: true,
                  message: '账号不能为空',
                },
              ],
            })(<Input disabled={!!get(rowData, 'account')} />)}
          </FormItem>
          <FormItem label="昵称">
            {getFieldDecorator('nickname', {
              initialValue: get(rowData, 'nickname'),
              rules: [
                {
                  required: true,
                  message: '昵称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="手机号">
            {getFieldDecorator('phone', {
              initialValue: get(rowData, 'phone'),
              rules: [
                {
                  validator: this.validatePhone,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="电子邮箱">
            {getFieldDecorator('email', {
              initialValue: get(rowData, 'email'),
              rules: [
                {
                  type: 'email',
                  message: '电子邮箱格式不正确!',
                },
                {
                  required: true,
                  message: '电子邮箱不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="停用">
            {getFieldDecorator('status', {
              initialValue: get(rowData, 'status', false),
              valuePropName: 'checked',
            })(<Switch size="small" disabled={get(rowData, 'admin')} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
