import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { Form, Input, Radio } from 'antd';
import { ExtModal, message, ExtIcon } from 'suid';

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
class ModuleDetail extends PureComponent {
  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { rowData } = props;
    this.state = {
      moduleType: get(rowData, 'nameSpace') ? 'java' : 'web',
    };
  }

  componentDidUpdate(preProps) {
    const { rowData } = this.props;
    if (!isEqual(preProps.rowData, rowData)) {
      this.setState({ moduleType: get(rowData, 'nameSpace') ? 'java' : 'web' });
    }
  }

  handlerCopy = text => {
    copy(text);
    message.success(`已复制到粘贴板`);
  };

  renderGitAddress = () => {
    const { rowData } = this.props;
    const gitUrl = get(rowData, 'gitHttpUrl');
    if (gitUrl) {
      return (
        <>
          Git地址
          <ExtIcon
            type="copy"
            className="copy-btn"
            antd
            style={{ marginTop: 4 }}
            tooltip={{ title: '复制Git地址到粘贴板' }}
            onClick={() => this.handlerCopy(gitUrl)}
          />
        </>
      );
    }
    return ' Git地址';
  };

  render() {
    const { moduleType } = this.state;
    const { form, rowData, showModal, closeFormModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        centered
        destroyOnClose
        width={580}
        visible={showModal}
        onCancel={closeFormModal}
        bodyStyle={{ padding: 0 }}
        title="模块申请详情"
        footer={null}
      >
        <Form {...formItemLayout} layout="horizontal" style={{ padding: '8px 24px' }}>
          <FormItem label="所属应用">
            {getFieldDecorator('appName', {
              initialValue: get(rowData, 'appName'),
              rules: [
                {
                  required: true,
                  message: '所属应用不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator('moduleType', {
              initialValue: moduleType,
              rules: [
                {
                  required: true,
                  message: '模块类型不能为空',
                },
              ],
            })(
              <Radio.Group disabled size="small">
                <Radio.Button key="web" value="web">
                  前端模块
                </Radio.Button>
                <Radio.Button key="java" value="java">
                  后端模块
                </Radio.Button>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="模块代码">
            {getFieldDecorator('code', {
              initialValue: get(rowData, 'code'),
              rules: [
                {
                  required: true,
                  message: '模块代码不能为空',
                },
              ],
            })(<Input placeholder="规则：字母小写或中横线" disabled />)}
          </FormItem>
          <FormItem label="模块名称">
            {getFieldDecorator('name', {
              initialValue: get(rowData, 'name'),
              rules: [
                {
                  required: true,
                  message: '模块名称不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="模块版本">
            {getFieldDecorator('version', {
              initialValue: get(rowData, 'version'),
              rules: [
                {
                  required: true,
                  message: '模块版本不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="模块描述">
            {getFieldDecorator('remark', {
              initialValue: get(rowData, 'remark'),
              rules: [
                {
                  required: true,
                  message: '模块描述不能为空',
                },
              ],
            })(<TextArea style={{ resize: 'none' }} rows={3} disabled />)}
          </FormItem>
          <FormItem label="命名空间(包路径)">
            {getFieldDecorator('nameSpace', {
              initialValue: get(rowData, 'nameSpace'),
              rules: [
                {
                  required: moduleType === 'java',
                  message: '命名空间(包路径)不能为空',
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={this.renderGitAddress()}>
            {getFieldDecorator('gitHttpUrl', {
              initialValue: get(rowData, 'gitHttpUrl'),
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default ModuleDetail;
