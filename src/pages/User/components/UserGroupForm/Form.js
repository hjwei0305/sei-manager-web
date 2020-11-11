import React, { PureComponent } from 'react';
import cls from 'classnames';
import { toUpper, trim } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input } from 'antd';
import { ComboList, utils } from 'suid';
import { constants } from '@/utils';
import styles from './Form.less';

const { objectAssignAppend } = utils;
const { SERVER_PATH } = constants;
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
  constructor(props) {
    super(props);
    const { groupData } = this.props;
    this.state = {
      currentAppModuleCode: groupData ? groupData.appModuleCode : '',
    };
  }

  handlerFormSubmit = () => {
    const { form, saveFeatureGroup, groupData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const data = objectAssignAppend(getFieldsValue(), groupData || {});
      data.code = `${data.appModuleCode}-${toUpper(trim(data.code))}`;
      saveFeatureGroup(data, handlerPopoverHide);
    });
  };

  getCode = () => {
    const { groupData } = this.props;
    let newCode = '';
    if (groupData) {
      const { code, appModuleCode } = groupData;
      newCode = code.substring(appModuleCode.length + 1);
    }
    return newCode;
  };

  render() {
    const { currentAppModuleCode } = this.state;
    const { form, groupData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = groupData ? '编辑功能项组' : '新建功能项组';
    getFieldDecorator('appModuleId', { initialValue: groupData ? groupData.appModuleId : '' });
    getFieldDecorator('appModuleCode', { initialValue: groupData ? groupData.appModuleCode : '' });
    const appModuleProps = {
      form,
      name: 'appModuleName',
      field: ['appModuleId', 'appModuleCode'],
      searchPlaceHolder: '输入名称关键字查询',
      store: {
        url: `${SERVER_PATH}/sei-basic/appModule/findAllUnfrozen`,
      },
      afterSelect: item => {
        this.setState({ currentAppModuleCode: item.code });
      },
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">{title}</span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label="应用模块">
              {getFieldDecorator('appModuleName', {
                initialValue: groupData ? groupData.appModuleName : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'feature.group.appModule.required',
                      defaultMessage: '请选择应用模块',
                    }),
                  },
                ],
              })(<ComboList {...appModuleProps} />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
              {getFieldDecorator('name', {
                initialValue: groupData ? groupData.name : '',
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
                  disabled={!!groupData}
                  addonBefore={`${currentAppModuleCode}-`}
                  maxLength={30}
                  placeholder={formatMessage({
                    id: 'global.code.tip',
                    defaultMessage: '规则:名称各汉字首字母大写',
                  })}
                />,
              )}
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
