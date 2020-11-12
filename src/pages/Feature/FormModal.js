import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, BannerTitle } from 'suid';

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
    const { form, save, currentFeaturePage } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        type: 1,
      };
      Object.assign(params, currentFeaturePage || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, currentFeaturePage, closePageFormModal, saving, showPageFormModal } = this.props;
    const { getFieldDecorator } = form;
    const title = currentFeaturePage ? '修改' : '新建';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closePageFormModal}
        visible={showPageFormModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={<BannerTitle title={title} subTitle="页面功能项" />}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: get(currentFeaturePage, 'name'),
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="页面地址">
            {getFieldDecorator('url', {
              initialValue: get(currentFeaturePage, 'url'),
              rules: [
                {
                  required: true,
                  message: '页面地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="附加地址">
            {getFieldDecorator('extUrl', {
              initialValue: get(currentFeaturePage, 'extUrl'),
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
