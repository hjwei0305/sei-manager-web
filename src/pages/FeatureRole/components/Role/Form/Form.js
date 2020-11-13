import React, { PureComponent } from 'react';
import cls from 'classnames';
import { toUpper, trim, get } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Switch } from 'antd';
import { ComboList, ComboTree } from 'suid';
import { constants } from '@/utils';
import styles from './Form.less';

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
class RoleGroupForm extends PureComponent {
  constructor(props) {
    super(props);
    const { roleData } = this.props;
    this.state = {
      isPublicRole: this.getIsPublicRole(roleData),
    };
  }

  getIsPublicRole = role => role && (!!role.publicUserType || !!role.publicOrgId);

  onFormSubmit = () => {
    const { form, saveFeatureRole, roleData, handlerPopoverHide, currentRoleGroup } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const { isPublicRole } = this.state;
      const params = {
        featureRoleGroupId: currentRoleGroup.id,
        featureRoleGroupCode: currentRoleGroup.code,
        featureRoleGroupName: currentRoleGroup.name,
      };
      Object.assign(params, roleData || {});
      Object.assign(params, formData);
      params.code = `${params.featureRoleGroupCode}-${toUpper(trim(params.code))}`;
      if (!isPublicRole) {
        Object.assign(params, {
          publicUserType: null,
          publicOrgCode: null,
          publicOrgId: null,
          publicOrgName: null,
        });
      }
      saveFeatureRole(params, handlerPopoverHide);
    });
  };

  getCode = () => {
    const { roleData } = this.props;
    let newCode = '';
    if (roleData) {
      const { code, featureRoleGroupCode } = roleData;
      newCode = code.substring(featureRoleGroupCode.length + 1);
    }
    return newCode;
  };

  handlerPubRoleChange = checked => {
    this.setState({ isPublicRole: checked });
  };

  render() {
    const { isPublicRole } = this.state;
    const { form, roleData, saving, currentRoleGroup } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('roleType', { initialValue: get(roleData, 'roleType', null) || null });
    getFieldDecorator('publicUserType', {
      initialValue: roleData ? roleData.publicUserType : null,
    });
    getFieldDecorator('publicOrgId', { initialValue: get(roleData, 'publicOrgId', null) || null });
    getFieldDecorator('publicOrgCode', {
      initialValue: get(roleData, 'publicOrgCode', null) || null,
    });
    const title = roleData ? '修改角色' : '新建角色';
    const roleTypeProps = {
      form,
      name: 'roleTypeRemark',
      field: ['roleType'],
      showSearch: false,
      store: {
        autoLoad: true,
        url: `${SERVER_PATH}/sei-basic/featureRole/listAllRoleTypeList`,
      },
      afterLoaded: data => {
        if (data && data instanceof Array && data.length > 0 && !roleData) {
          form.setFieldsValue({
            roleTypeRemark: data[0].remark,
            roleType: data[0].name,
          });
        }
      },
      reader: {
        name: 'remark',
        field: ['name'],
      },
    };
    const publicUserTypeProps = {
      form,
      name: 'userTypeRemark',
      field: ['publicUserType'],
      showSearch: false,
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRole/listAllUserType`,
      },
      reader: {
        name: 'remark',
        field: ['name'],
      },
    };
    const publicOrgNameProps = {
      form,
      name: 'publicOrgName',
      field: ['publicOrgId', 'publicOrgCode'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
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
            <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
              {getFieldDecorator('name', {
                initialValue: get(roleData, 'name', ''),
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
                  addonBefore={`${currentRoleGroup.code}-`}
                  maxLength={50}
                  placeholder={formatMessage({
                    id: 'global.code.tip',
                    defaultMessage: '规则:名称各汉字首字母大写',
                  })}
                />,
              )}
            </FormItem>
            <FormItem label="角色类型">
              {getFieldDecorator('roleTypeRemark', {
                initialValue: get(roleData, 'roleTypeRemark', ''),
              })(<ComboList {...roleTypeProps} />)}
            </FormItem>
            <FormItem label="公共角色">
              {getFieldDecorator('isPublicRole', {
                initialValue: this.getIsPublicRole(roleData),
                valuePropName: 'checked',
              })(
                <Switch
                  size="small"
                  onChange={(checked, e) => this.handlerPubRoleChange(checked, e)}
                />,
              )}
            </FormItem>
            {isPublicRole ? (
              <>
                <FormItem label="用户类型">
                  {getFieldDecorator('userTypeRemark', {
                    initialValue: get(roleData, 'userTypeRemark', null),
                    rules: [
                      {
                        required: false,
                        message: '用户类型不能为空',
                      },
                    ],
                  })(<ComboList {...publicUserTypeProps} />)}
                </FormItem>
                <FormItem label="组织机构">
                  {getFieldDecorator('publicOrgName', {
                    initialValue: get(roleData, 'publicOrgName', null),
                    rules: [
                      {
                        required: false,
                        message: '组织机构不能为空',
                      },
                    ],
                  })(<ComboTree {...publicOrgNameProps} />)}
                </FormItem>
              </>
            ) : null}
            <FormItem wrapperCol={{ span: 4, offset: 5 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.onFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default RoleGroupForm;
