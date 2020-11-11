import React, { PureComponent } from 'react';
import { toUpper, trim } from 'lodash';
import { Form, Input, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
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
    const { form, save, currentUser, currentUserGroup } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        userGroupId: currentUserGroup.id,
        userGroupCode: currentUserGroup.code,
        userGroupName: currentUserGroup.name,
      };
      Object.assign(params, currentUser || {});
      Object.assign(params, formData);
      params.code = `${params.userGroupCode}-${toUpper(trim(params.code))}`;
      save(params);
    });
  };

  getCode = () => {
    const { currentUser } = this.props;
    let newCode = '';
    if (currentUser) {
      const { code, userGroupCode } = currentUser;
      newCode = code.substring(userGroupCode.length + 1);
    }
    return newCode;
  };

  render() {
    const {
      form,
      currentUser,
      closeFormModal,
      saving,
      showFormModal,
      currentUserGroup,
    } = this.props;
    const { getFieldDecorator } = form;
    const title = currentUser
      ? formatMessage({
          id: 'user.page.edit',
          defaultMessage: '修改菜单项',
        })
      : formatMessage({ id: 'user.page.add', defaultMessage: '新建菜单项' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showFormModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: currentUser ? currentUser.name : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.name.required',
                    defaultMessage: '名称不能为空',
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'global.code', defaultMessage: '代码' })}>
            {getFieldDecorator('code', {
              initialValue: this.getCode(),
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.code.required',
                    defaultMessage: '代码不能为空',
                  }),
                },
              ],
            })(
              <Input
                addonBefore={`${currentUserGroup.code}-`}
                maxLength={50 - `${currentUserGroup.code}-`.length}
                placeholder={formatMessage({
                  id: 'global.code.tip',
                  defaultMessage: '规则:名称各汉字首字母大写',
                })}
              />,
            )}
          </FormItem>
          <FormItem label="页面路由地址">
            {getFieldDecorator('groupCode', {
              initialValue: currentUser ? currentUser.groupCode : '',
              rules: [
                {
                  required: true,
                  message: '页面路由地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'user.tenantCanUse', defaultMessage: '租户可用' })}>
            {getFieldDecorator('tenantCanUse', {
              initialValue: currentUser ? currentUser.tenantCanUse || false : false,
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
