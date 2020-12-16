import React, { PureComponent } from 'react';
import { get, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { Form, Input, Button, Card, List, Tag, Layout } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '../../../utils';
import styles from './FormModal.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Sider, Content } = Layout;
const { SERVER_PATH } = constants;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
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
    const { flowNodeData } = props;
    this.state = {
      flowNodeData,
    };
  }

  componentDidUpdate(preProps) {
    const { flowNodeData } = this.props;
    if (!isEqual(preProps.flowNodeData, flowNodeData)) {
      this.setState({ flowNodeData });
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

  validateVersion = (rule, value, callback) => {
    const reg = /^[1-9]\d{0,1}$/;
    if (value && !reg.test(value)) {
      callback('版本式不正确!');
    }
    callback();
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
    const { flowNodeData } = this.state;
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
        wrapClassName={styles['form-box']}
        visible={showModal}
        width={780}
        onCancel={closeFormModal}
        title={onlyView ? '应用详情' : title}
        footer={this.renderFooterBtn()}
      >
        <Layout className="auto-height">
          <Sider width={340} className="auto-height" theme="light">
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
                })(<Input autoComplete="off" disabled={onlyView} />)}
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
                })(<Input autoComplete="off" disabled={onlyView} />)}
              </FormItem>
              <FormItem label="所属组">
                {getFieldDecorator('groupName', {
                  initialValue: get(rowData, 'groupName'),
                  rules: [
                    {
                      required: true,
                      message: '所属组不能为空',
                    },
                  ],
                })(<ComboList {...groupProps} disabled={onlyView} />)}
              </FormItem>
              <FormItem label="初始版本">
                {getFieldDecorator('version', {
                  initialValue: get(rowData, 'version'),
                  rules: [
                    {
                      required: true,
                      message: '初始版本不能为空',
                    },
                    {
                      validator: this.validateVersion,
                    },
                  ],
                })(
                  <Input
                    placeholder="最多2位数字且不能以0开始"
                    autoComplete="off"
                    disabled={onlyView}
                  />,
                )}
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
