import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '../../utils';

const { SERVER_PATH } = constants;
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

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改服务器节点' : '新建服务器节点';
    const envProps = {
      form,
      name: 'envName',
      store: {
        url: `${SERVER_PATH}/sei-manager/env/findAllUnfrozen`,
      },
      showSearch: false,
      pagination: false,
      field: ['envCode'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['code'],
      },
    };
    getFieldDecorator('envCode', { initialValue: get(rowData, 'envCode') });
    const certificateProps = {
      form,
      name: 'certificateName',
      store: {
        url: `${SERVER_PATH}/sei-manager/certificate/findAllUnfrozen`,
      },
      showSearch: false,
      pagination: false,
      field: ['certificateId'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['id'],
      },
    };
    getFieldDecorator('certificateId', { initialValue: get(rowData, 'certificateId') });
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
            {getFieldDecorator('envName', {
              initialValue: get(rowData, 'envName'),
              rules: [
                {
                  required: true,
                  message: '运行环境不能为空',
                },
              ],
            })(<ComboList {...envProps} />)}
          </FormItem>
          <FormItem label="凭证">
            {getFieldDecorator('certificateName', {
              initialValue: get(rowData, 'certificateName'),
              rules: [
                {
                  required: true,
                  message: '凭证不能为空',
                },
              ],
            })(<ComboList {...certificateProps} />)}
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
