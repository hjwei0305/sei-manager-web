import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
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
    const { form, save, currentFeatureRole } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, currentFeatureRole || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, currentFeatureRole, closeRoleFormModal, saving, showRoleFormModal } = this.props;
    const { getFieldDecorator } = form;
    const title = currentFeatureRole ? '修改' : '新建';
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeRoleFormModal}
        visible={showRoleFormModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        width={380}
        onOk={this.handlerFormSubmit}
        title={<BannerTitle title={title} subTitle="角色" />}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="角色名称">
            {getFieldDecorator('name', {
              initialValue: get(currentFeatureRole, 'name'),
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="角色描述">
            {getFieldDecorator('description', {
              initialValue: get(currentFeatureRole, 'description'),
            })(<Input autoComplete="off" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
