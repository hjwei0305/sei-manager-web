import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { Form, Input, Button, Radio, Alert, Layout, Card, List, Tag } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '../../../utils';
import styles from './FormModal.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Sider, Content } = Layout;
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
    flowNodeData: PropTypes.array,
    onlyView: PropTypes.bool,
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
    save: PropTypes.func,
    saving: PropTypes.bool,
    saveToApprove: PropTypes.func,
    saveToApproving: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { rowData, flowNodeData } = props;
    this.state = {
      moduleType: get(rowData, 'nameSpace') ? 'java' : 'web',
      flowNodeData,
    };
  }

  componentDidUpdate(preProps) {
    const { rowData, flowNodeData } = this.props;
    if (!isEqual(preProps.rowData, rowData) || !isEqual(preProps.flowNodeData, flowNodeData)) {
      this.setState({ moduleType: get(rowData, 'nameSpace') ? 'java' : 'web' }, flowNodeData);
    }
  }

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

  handlerModuleTypeChange = e => {
    const { form } = this.props;
    const moduleType = e.target.value;
    if (moduleType === 'web') {
      form.setFieldsValue({ nameSpace: '' });
    }
    this.setState({ moduleType });
  };

  render() {
    const { moduleType, flowNodeData } = this.state;
    const { form, rowData, showModal, closeFormModal, onlyView } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改模块申请' : '新建模块申请';
    getFieldDecorator('appId', { initialValue: get(rowData, 'appId') });
    const appProps = {
      form,
      name: 'appName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/application/findByPage`,
        params: {
          filters: [{ fieldName: 'frozen', operator: 'EQ', value: false }],
        },
      },
      afterSelect: item => {
        form.setFieldsValue({ version: `${item.version}.0.0` });
      },
      remotePaging: true,
      field: ['appId'],
      reader: {
        name: 'name',
        description: 'remark',
        field: ['id'],
      },
    };
    const nodeUserListProps = {
      form,
      name: 'handleUserName',
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/user/findByPage`,
      },
      style: { width: 160 },
      width: 220,
      placeholder: '请先选择审核人',
      remotePaging: true,
      field: ['handleAccount'],
      reader: {
        name: 'nickname',
        description: 'account',
        field: ['account'],
      },
    };
    return (
      <ExtModal
        maskClosable={false}
        centered
        destroyOnClose
        width={880}
        wrapClassName={styles['form-box']}
        visible={showModal}
        onCancel={closeFormModal}
        bodyStyle={{ padding: 0 }}
        title={onlyView ? '模块详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <Alert message="提示:模块代码一旦创建后不能修改" banner />
            <Form {...formItemLayout} layout="horizontal" style={{ margin: 24 }}>
              <FormItem label="所属应用">
                {getFieldDecorator('appName', {
                  initialValue: get(rowData, 'appName'),
                  rules: [
                    {
                      required: true,
                      message: '所属应用不能为空',
                    },
                  ],
                })(<ComboList {...appProps} disabled={onlyView} />)}
              </FormItem>
              <FormItem style={{ marginBottom: 0, marginLeft: 84 }}>
                {getFieldDecorator('moduleType', {
                  initialValue: moduleType,
                  rules: [
                    {
                      required: true,
                      message: '模块类型不能为空',
                    },
                  ],
                })(
                  <Radio.Group
                    onChange={this.handlerModuleTypeChange}
                    disabled={onlyView}
                    size="small"
                  >
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
                })(<Input autoComplete="off" disabled={!!rowData || onlyView} />)}
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
                })(<Input autoComplete="off" disabled={onlyView} />)}
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
                })(<TextArea style={{ resize: 'none' }} rows={3} disabled={onlyView} />)}
              </FormItem>
              <FormItem label="命名空间">
                {getFieldDecorator('nameSpace', {
                  initialValue: get(rowData, 'nameSpace'),
                  rules: [
                    {
                      required: moduleType === 'java',
                      message: '命名空间(包路径)不能为空',
                    },
                  ],
                })(
                  <Input
                    autoComplete="off"
                    placeholder="命名空间(包路径)"
                    disabled={onlyView || moduleType === 'web'}
                  />,
                )}
              </FormItem>
              {onlyView ? (
                <>
                  <FormItem label="Git地址">
                    {getFieldDecorator('gitUrl', {
                      initialValue: get(rowData, 'gitUrl'),
                    })(<Input disabled />)}
                  </FormItem>
                </>
              ) : null}
            </Form>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            <Card title="评审活动" bordered={false} size="small">
              <List
                dataSource={flowNodeData}
                renderItem={(item, idx) => (
                  <List.Item>
                    <span>
                      <Tag>{idx + 1}</Tag>
                      {item.name}
                    </span>
                    <ComboList {...nodeUserListProps} />
                  </List.Item>
                )}
              />
            </Card>
          </Content>
        </Layout>
      </ExtModal>
    );
  }
}

export default FormModal;
