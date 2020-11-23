import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal, ComboList } from 'suid';

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
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  getEnvRemark = key => {
    const { evnData } = this.props;
    const env = evnData.filter(e => e.key === key);
    if (env.length === 1) {
      return env[0].title;
    }
    return '';
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal, evnData } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改凭证' : '新建凭证';
    const envProps = {
      form,
      name: 'envRemark',
      dataSource: evnData,
      rowKey: 'key',
      reader: {
        name: 'title',
        field: ['key'],
      },
      afterSelect: item => {
        form.setFieldsValue({ env: item.key });
      },
    };
    const env = get(rowData, 'env');
    getFieldDecorator('env', { initialValue: env });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={480}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="运行环境">
            {getFieldDecorator('envRemark', {
              initialValue: this.getEnvRemark(env),
              rules: [
                {
                  required: true,
                  message: '运行环境不能为空',
                },
              ],
            })(<ComboList {...envProps} />)}
          </FormItem>
          <FormItem label="节点名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '节点名称不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="节点地址">
            {getFieldDecorator('address', {
              initialValue: get(rowData, 'address'),
              rules: [
                {
                  required: true,
                  message: '节点地址不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="节点描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
