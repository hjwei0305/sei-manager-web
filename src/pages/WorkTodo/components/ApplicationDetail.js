import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { ExtModal } from 'suid';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class ApplicationDetail extends PureComponent {
  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
  };

  renderFooterBtn = () => {
    const { closeFormModal, onlyView } = this.props;
    if (onlyView) {
      return (
        <Button type="primary" onClick={closeFormModal}>
          关闭
        </Button>
      );
    }
  };

  render() {
    const { form, rowData, showModal, closeFormModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        centered
        destroyOnClose
        visible={showModal}
        onCancel={closeFormModal}
        bodyStyle={{ padding: 0 }}
        title="应用申请详情"
        footer={null}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ margin: '8px 24px' }}>
          <FormItem label="应用代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '应用代码不能为空',
                },
              ],
            })(<Input placeholder="规则：字母小写或中横线" autoComplete="off" disabled />)}
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
            })(<Input autoComplete="off" disabled />)}
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
            })(<Input autoComplete="off" disabled />)}
          </FormItem>
          <FormItem label="应用初始版本">
            {getFieldDecorator('version', {
              initialValue: get(rowData, 'version'),
              rules: [
                {
                  required: true,
                  message: '应用初始版本不能为空',
                },
              ],
            })(<Input placeholder="最多2位数字且不能以0开始" autoComplete="off" disabled />)}
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
            })(<TextArea style={{ resize: 'none' }} rows={3} disabled />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default ApplicationDetail;
