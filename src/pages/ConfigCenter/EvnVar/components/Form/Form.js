import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get, omit } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Switch } from 'antd';
import { BannerTitle } from 'suid';
import { constants } from '@/utils';
import styles from './Form.less';

const { USER_STATUS } = constants;
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
    const { form, save, data, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const params = { ...data };
      const formData = getFieldsValue();
      if (formData.hasOwnProperty('enable')) {
        if (formData.enable === true) {
          Object.assign(formData, { useStatus: USER_STATUS.ENABLE.key });
        } else {
          Object.assign(formData, { useStatus: USER_STATUS.DISABLE.key });
        }
      }
      Object.assign(params, getFieldsValue());
      save(omit(params, 'enable'), handlerPopoverHide);
    });
  };

  render() {
    const { form, data, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = data ? '编辑' : '新建';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <BannerTitle title={title} subTitle="变量" />
          </div>
          <Form {...formItemLayout}>
            <FormItem label="键名">
              {getFieldDecorator('code', {
                initialValue: get(data, 'code'),
                rules: [
                  {
                    required: true,
                    message: '键名不能为空',
                  },
                ],
              })(<Input disabled={!!data} autoComplete="off" />)}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('remark', {
                initialValue: get(data, 'remark'),
                rules: [
                  {
                    required: true,
                    message: '描述不能为空',
                  },
                ],
              })(<Input autoComplete="off" />)}
            </FormItem>
            {data ? (
              <FormItem label="启用">
                {getFieldDecorator('enable', {
                  valuePropName: 'checked',
                  initialValue: USER_STATUS.ENABLE.key === get(data, 'useStatus'),
                })(<Switch size="small" />)}
              </FormItem>
            ) : null}
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
