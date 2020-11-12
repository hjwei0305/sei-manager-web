import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal, BannerTitle, ComboList } from 'suid';
import { constants } from '@/utils';

const { REQUEST_TYPE } = constants;
const REQUEST_TYPE_DATA = Object.keys(REQUEST_TYPE).map(key => REQUEST_TYPE[key]);
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
    const { form, save, currentFeatureHandler, selectedFeaturePage } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        parentId: get(selectedFeaturePage, 'id'),
        type: 2,
      };
      Object.assign(params, currentFeatureHandler || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, currentFeatureHandler, closeFormModal, saving, showFormModal } = this.props;
    const { getFieldDecorator } = form;
    const methodProps = {
      form,
      name: 'method',
      showSearch: false,
      dataSource: REQUEST_TYPE_DATA,
      rowKey: 'key',
      pagination: false,
      reader: {
        name: 'key',
      },
    };
    const title = currentFeatureHandler ? '修改' : '新建';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showFormModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={<BannerTitle title={title} subTitle="功能权限" />}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="权限代码">
            {getFieldDecorator('permission', {
              initialValue: get(currentFeatureHandler, 'permission'),
              rules: [
                {
                  required: true,
                  message: '权限代码不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="权限名称">
            {getFieldDecorator('name', {
              initialValue: get(currentFeatureHandler, 'name'),
              rules: [
                {
                  required: true,
                  message: '权限名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="请求方法">
            {getFieldDecorator('method', {
              initialValue: get(currentFeatureHandler, 'method'),
            })(<ComboList {...methodProps} />)}
          </FormItem>
          <FormItem label="接口地址">
            {getFieldDecorator('url', {
              initialValue: get(currentFeatureHandler, 'url'),
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
