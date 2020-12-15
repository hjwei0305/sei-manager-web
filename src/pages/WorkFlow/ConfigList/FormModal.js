import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Card } from 'antd';
import { ExtModal, ListCard, MoneyInput } from 'suid';
import { constants } from '@/utils';
import styles from './FormModal.less';

const FormItem = Form.Item;
const { SERVER_PATH } = constants;
const { TextArea, Search } = Input;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class FormModal extends PureComponent {
  static listCardRef;

  static propTypes = {
    rowData: PropTypes.object,
    showModal: PropTypes.bool,
    save: PropTypes.func,
    closeFormModal: PropTypes.func,
    saving: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      nodeUser: [],
    };
  }

  handlerFormSubmit = () => {
    const { form, save, currentFlowType, rowData } = this.props;
    const { nodeUser } = this.state;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        flowType: get(currentFlowType, 'name'),
      };
      Object.assign(params, rowData);
      Object.assign(params, formData);
      Object.assign(params, {
        nodes: nodeUser.join(','),
      });
      save(params);
    });
  };

  handlerNodeUserSelect = keys => {
    this.setState({
      nodeUser: [...keys],
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  closeFormModal = () => {
    const { closeFormModal } = this.props;
    this.setState({ nodeUser: [] });
    if (closeFormModal) {
      closeFormModal();
    }
  };

  renderNodeUser = item => {
    return (
      <>
        <div>{`账号：${item.account}`}</div>
        <div>{`电子邮箱：${item.email}`}</div>
      </>
    );
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder="代码、名称、描述"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  render() {
    const { nodeUser } = this.state;
    const { form, saving, showModal, rowData } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '新建审核步骤' : '修改审核步骤';
    const nodeUserListProps = {
      className: 'left-content',
      selectedKeys: nodeUser,
      title: '审核人员',
      showSearch: false,
      onSelectChange: this.handlerNodeUserSelect,
      customTool: this.renderCustomTool,
      searchProperties: ['account', 'nickname'],
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.nickname,
        description: this.renderNodeUser,
      },
      checkbox: true,
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-manager/user/findByPage`,
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.closeFormModal}
        visible={showModal}
        centered
        width={820}
        maskClosable={false}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Card bordered={false} className="item-box" title="步骤信息">
              <Form {...formItemLayout} layout="horizontal">
                <FormItem label="序号">
                  {getFieldDecorator('rank', {
                    initialValue: get(rowData, 'rank'),
                    rules: [
                      {
                        required: true,
                        message: '序号不能为空',
                      },
                    ],
                  })(<MoneyInput textAlign="left" thousand={false} precision={0} />)}
                </FormItem>
                <FormItem label="审核步骤名称">
                  {getFieldDecorator('name', {
                    initialValue: get(rowData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '审核步骤名称不能为空',
                      },
                    ],
                  })(<Input autoComplete="off" />)}
                </FormItem>
                <FormItem label="审核步骤描述">
                  {getFieldDecorator('remark', {
                    initialValue: get(rowData, 'remark'),
                    rules: [
                      {
                        required: true,
                        message: '审核步骤描述不能为空',
                      },
                    ],
                  })(<TextArea style={{ resize: 'none' }} rows={3} />)}
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <ListCard {...nodeUserListProps} />
          </Col>
        </Row>
      </ExtModal>
    );
  }
}

export default FormModal;
