import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const colFormItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
@Form.create()
class FormModal extends PureComponent {
  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData, {
        password: formData.password ? window.btoa(formData.password) : undefined,
      });
      if (onSave) {
        onSave(params);
      }
    });
  };

  getProcessedUrl = data => {
    const { form } = this.props;
    const formData = form.getFieldsValue();
    Object.assign(formData, { database: formData.code }, data);
    if (this.dbTypeTemplate) {
      const url = this.dbTypeTemplate.replace(/\{([A-Za-z]+)\}/g, (q, $1) => {
        if (formData[$1]) {
          return formData[$1];
        }
        return q;
      });
      form.setFieldsValue({
        url,
      });
    }
  };

  getDbTypeComboListProps = () => {
    const { form } = this.props;

    return {
      form,
      name: 'dbType',
      store: {
        autoLoad: false,
        url: `${SERVER_PATH}/sei-manager/dataSource/getDBTypes`,
      },
      rowKey: 'name',
      reader: {
        name: 'name',
      },
      afterSelect: item => {
        const { temp: tempUrl, port: tempPort, name } = item;
        this.dbTypeTemplate = tempUrl;
        if (this.dbType !== name) {
          this.getProcessedUrl({ port: tempPort });
          form.setFieldsValue({
            port: tempPort,
          });
        }
        this.dbType = name;
      },
    };
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="数据库类型">
            {getFieldDecorator('dbType', {
              initialValue: editData && editData.dbType,
              rules: [
                {
                  required: true,
                  message: '数据库类型不能为空',
                },
              ],
            })(<ComboList {...this.getDbTypeComboListProps()} />)}
          </FormItem>
          <FormItem label="数据库名">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '数据库名不能为空',
                },
                {
                  pattern: /[a-zA-Z]+/,
                  message: '数据库名只能是英文名称',
                },
              ],
            })(
              <Input
                onChange={e => {
                  this.getProcessedUrl({ database: e.target.value });
                }}
              />,
            )}
          </FormItem>
          <FormItem label="描述">
            {getFieldDecorator('remark', {
              initialValue: editData && editData.remark,
            })(<TextArea />)}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="域名">
                {getFieldDecorator('host', {
                  initialValue: editData && editData.host,
                  rules: [
                    {
                      required: true,
                      message: '域名不能为空',
                    },
                    // {
                    //   pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    //   message: '域名格式不对，正确格式如127.0.0.1',
                    // },
                  ],
                })(
                  <Input
                    onChange={e => {
                      this.getProcessedUrl({ host: e.target.value });
                    }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="端口">
                {getFieldDecorator('port', {
                  initialValue: editData && editData.port,
                  rules: [
                    {
                      required: true,
                      message: '端口不能为空',
                    },
                  ],
                })(
                  <Input
                    onChange={e => {
                      this.getProcessedUrl({ port: e.target.value });
                    }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="用户名">
                {getFieldDecorator('username', {
                  initialValue: editData && editData.username,
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...colFormItemLayout} label="密码">
                {getFieldDecorator('password', {
                  initialValue: editData && editData.password,
                })(<Input.Password />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="url地址">
            {getFieldDecorator('url', {
              initialValue: editData && editData.url,
              rules: [
                {
                  required: true,
                  message: 'url地址不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
