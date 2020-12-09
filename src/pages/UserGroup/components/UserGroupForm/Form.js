import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input } from 'antd';
import { BannerTitle } from 'suid';
import styles from './Form.less';

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
class FeatureGroupForm extends PureComponent {
  handlerFormSubmit = () => {
    const { form, saveUserGroup, groupData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const params = { ...groupData };
      Object.assign(params, getFieldsValue());
      saveUserGroup(params, handlerPopoverHide);
    });
  };

  validateName = (rule, value, callback) => {
    const reg = /^[a-z0-9A-Z-]*$/;
    if (value && !reg.test(value)) {
      callback('用户组名称格式不正确!');
    }
    callback();
  };

  render() {
    const { form, groupData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = groupData ? '编辑' : '新建';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <BannerTitle title={title} subTitle="用户组" />
          </div>
          <Form {...formItemLayout}>
            <FormItem label="用户组名称">
              {getFieldDecorator('name', {
                initialValue: get(groupData, 'name'),
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'global.name.required',
                      defaultMessage: '名称不能为空',
                    }),
                  },
                  {
                    validator: this.validateName,
                  },
                ],
              })(
                <Input
                  disabled={!!groupData}
                  autoComplete="off"
                  placeholder="字母开头且由字母、数字或短横线组成"
                />,
              )}
            </FormItem>
            <FormItem label="用户组描述">
              {getFieldDecorator('description', {
                initialValue: get(groupData, 'description'),
                rules: [
                  {
                    required: true,
                    message: '用户组描述不能为空',
                  },
                ],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 6 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.handlerFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default FeatureGroupForm;
