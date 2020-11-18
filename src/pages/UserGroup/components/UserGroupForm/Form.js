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
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class FeatureGroupForm extends PureComponent {
  handlerFormSubmit = () => {
    const { form, saveFeatureGroup, groupData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const params = { ...groupData };
      Object.assign(params, getFieldsValue());
      saveFeatureGroup(params, handlerPopoverHide);
    });
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
            <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
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
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="代码">
              {getFieldDecorator('code', {
                initialValue: get(groupData, 'code'),
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'global.code.required',
                      defaultMessage: '代码不能为空',
                    }),
                  },
                ],
              })(<Input maxLength={30} />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 5 }} className="btn-submit">
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
