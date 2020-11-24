import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
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
    const { form, saveDeployTemplate, templateData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const params = { ...templateData };
      Object.assign(params, getFieldsValue());
      saveDeployTemplate(params, handlerPopoverHide);
    });
  };

  render() {
    const { form, templateData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = templateData ? '编辑' : '新建';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <BannerTitle title={title} subTitle="模板" />
          </div>
          <Form {...formItemLayout}>
            <FormItem label="模板名称">
              {getFieldDecorator('name', {
                initialValue: get(templateData, 'name'),
                rules: [
                  {
                    required: true,
                    message: '模板名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="模板描述">
              {getFieldDecorator('remark', {
                initialValue: get(templateData, 'remark'),
                rules: [
                  {
                    required: true,
                    message: '描述不能为空',
                  },
                ],
              })(<Input maxLength={30} />)}
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
