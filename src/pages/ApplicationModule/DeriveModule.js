import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { ExtModal, ComboList, BannerTitle } from 'suid';
import { constants } from '../../utils';

const FormItem = Form.Item;
const { SERVER_PATH } = constants;
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
  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    currentModule: PropTypes.object,
    save: PropTypes.func,
    saving: PropTypes.bool,
  };

  handlerFormSubmit = () => {
    const { form, save, currentModule } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        appId: get(formData, 'appId'),
        moduleId: get(currentModule, 'id'),
        namespace: get(formData, 'namespace'),
      };
      Object.assign(params, currentModule || {});
      Object.assign(params, formData);

      save(params);
    });
  };

  render() {
    const { form, currentModule, showModal, closeFormModal, saving } = this.props;
    const { getFieldDecorator } = form;
    const namespace = get(currentModule, 'nameSpace');
    getFieldDecorator('appId');
    const appProps = {
      form,
      name: 'appName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPageNoAuth`,
        params: {
          filters: [
            { fieldName: 'groupCode', operator: 'NE', value: get(currentModule, 'groupCode') },
            { fieldName: 'frozen', operator: 'EQ', value: false },
          ],
        },
      },
      remotePaging: true,
      field: ['appId'],
      reader: {
        name: 'name',
        description: 'code',
        field: ['id'],
      },
    };
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        width={380}
        visible={showModal}
        onCancel={closeFormModal}
        confirmLoading={saving}
        bodyStyle={{ padding: 0 }}
        title={<BannerTitle title="生成二开项目" subTitle={get(currentModule, 'name')} />}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: '8px 24px' }}>
          <FormItem label="目标应用">
            {getFieldDecorator('appName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '目标应用不能为空',
                },
              ],
            })(<ComboList {...appProps} />)}
          </FormItem>
          {namespace ? (
            <FormItem label="命名空间">
              {getFieldDecorator('namespace', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '命名空间不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
          ) : null}
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
