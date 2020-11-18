import React, { PureComponent } from 'react';
import { get } from 'lodash';
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
  onFormSubmit = () => {
    const { form, save, currentUser, userGroup } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        userGroupId: userGroup.id,
      };
      Object.assign(params, currentUser || {});
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  handlerCloseModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal) {
      closeFormModal();
    }
  };

  render() {
    const { form, currentUser, saving, showFormModal } = this.props;
    const { getFieldDecorator } = form;
    const title = currentUser
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.handlerCloseModal}
        visible={showFormModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        width={420}
        title={title}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="用户编号">
            {getFieldDecorator('code', {
              initialValue: get(currentUser, 'code', null),
              rules: [
                {
                  required: true,
                  message: '用户编号不能为空',
                },
                {
                  pattern: '^[A-Za-z0-9]{1,10}$',
                  message: '允许输入字母和数字,且不超过10个字符!',
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="用户姓名">
            {getFieldDecorator('userName', {
              initialValue: get(currentUser, 'userName', null),
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.name.required',
                    defaultMessage: '用户姓名不能为空',
                  }),
                },
              ],
            })(<Input autoComplete="off" />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: get(currentUser, 'frozen', false),
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
