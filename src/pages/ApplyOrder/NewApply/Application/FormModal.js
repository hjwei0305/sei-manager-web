import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { ExtModal, ComboList, MoneyInput } from 'suid';
import { constants } from '../../../../utils';

const { TextArea } = Input;
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
    rowData: PropTypes.object,
    save: PropTypes.func,
    saving: PropTypes.bool,
    saveToApprove: PropTypes.func,
    saveToApproving: PropTypes.bool,
  };

  handlerFormSubmit = approve => {
    const { form, save, rowData, saveToApprove } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      if (approve) {
        saveToApprove(params);
      } else {
        save(params);
      }
    });
  };

  renderFooterBtn = () => {
    const { saving, closeFormModal, saveToApproving, onlyView } = this.props;
    if (onlyView) {
      return (
        <Button type="primary" onClick={closeFormModal}>
          关闭
        </Button>
      );
    }
    return (
      <>
        <Button disabled={saving || saveToApproving} onClick={closeFormModal}>
          取消
        </Button>
        <Button
          disabled={saveToApproving}
          loading={saving}
          onClick={() => this.handlerFormSubmit()}
        >
          仅保存
        </Button>
        <Button
          disabled={saving}
          loading={saveToApproving}
          onClick={() => this.handlerFormSubmit(true)}
          type="primary"
        >
          保存并提交
        </Button>
      </>
    );
  };

  render() {
    const { form, rowData, showModal, closeFormModal, onlyView } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改应用申请' : '新建应用申请';
    getFieldDecorator('groupCode', { initialValue: get(rowData, 'groupCode') });
    const groupProps = {
      form,
      name: 'groupName',
      store: {
        url: `${SERVER_PATH}/sei-manager/userGroup/findAll`,
      },
      showSearch: false,
      pagination: false,
      field: ['groupCode'],
      reader: {
        name: 'name',
        description: 'description',
        field: ['code'],
      },
    };
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        visible={showModal}
        onCancel={closeFormModal}
        bodyStyle={{ paddingBottom: 0 }}
        title={onlyView ? '应用详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="应用代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '应用代码不能为空',
                },
              ],
            })(<Input disabled={onlyView} />)}
          </FormItem>
          <FormItem label="应用名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '应用名称不能为空',
                },
              ],
            })(<Input disabled={onlyView} />)}
          </FormItem>
          <FormItem label="应用所属组">
            {getFieldDecorator('groupName', {
              initialValue: get(rowData, 'groupName'),
              rules: [
                {
                  required: true,
                  message: '应用所属组不能为空',
                },
              ],
            })(<ComboList {...groupProps} disabled={onlyView} />)}
          </FormItem>
          <FormItem label="应用版本">
            {getFieldDecorator('version', {
              initialValue: get(rowData, 'version'),
              rules: [
                {
                  required: true,
                  message: '应用版本不能为空',
                },
              ],
            })(<MoneyInput textAlign="left" thousand={false} precision={0} disabled={onlyView} />)}
          </FormItem>
          <FormItem label="应用描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
              rules: [
                {
                  required: true,
                  message: '应用描述不能为空',
                },
              ],
            })(<TextArea style={{ resize: 'none' }} rows={3} disabled={onlyView} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
