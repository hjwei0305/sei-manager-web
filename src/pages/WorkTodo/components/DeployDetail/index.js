import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import { Form, Input, DatePicker, Layout, Row, Col, Card } from 'antd';
import { ExtModal, ExtIcon, BannerTitle, ScrollBar } from 'suid';
import { MdEditorView } from '@/components';
import TagList from './TagList';
import styles from './index.less';

const { Sider, Content } = Layout;
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
class DeployDetail extends PureComponent {
  static propTypes = {
    showModal: PropTypes.bool,
    closeFormModal: PropTypes.func,
    rowData: PropTypes.object,
    getTag: PropTypes.func,
  };

  renderTitle = () => {
    const { closeFormModal } = this.props;
    return (
      <>
        <ExtIcon onClick={closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle title="显示" subTitle="部署申请" />
      </>
    );
  };

  render() {
    const { form, rowData, showModal, closeFormModal, getTag } = this.props;
    const { getFieldDecorator } = form;
    const expCompleteTime = get(rowData, 'expCompleteTime');
    const tagId = get(rowData, 'refTagId');
    const tagListPros = {
      currentEnvCode: get(rowData, 'envCode'),
      currentModuleId: get(rowData, 'moduleId'),
      currentTagName: get(rowData, 'refTag'),
      getTag,
    };
    return (
      <ExtModal
        centered
        destroyOnClose
        visible={showModal}
        onCancel={closeFormModal}
        wrapClassName={styles['form-box']}
        bodyStyle={{ paddingBottom: 0 }}
        title={this.renderTitle()}
        footer={null}
      >
        <Layout className="auto-height">
          <Sider width={300} className="auto-height form-box" theme="light">
            <ScrollBar>
              <Form {...formItemLayout} layout="horizontal">
                <FormItem label="部署主题">
                  {getFieldDecorator('name', {
                    initialValue: get(rowData, 'name'),
                    rules: [
                      {
                        required: true,
                        message: '部署主题不能为空',
                      },
                    ],
                  })(<Input placeholder="请输入部署主题" disabled />)}
                </FormItem>
                <FormItem label="部署环境">
                  {getFieldDecorator('envName', {
                    initialValue: get(rowData, 'envName'),
                    rules: [
                      {
                        required: true,
                        message: '部署环境不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="部署应用">
                  {getFieldDecorator('appName', {
                    initialValue: get(rowData, 'appName'),
                    rules: [
                      {
                        required: true,
                        message: '部署应用不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="模块名称">
                  {getFieldDecorator('moduleName', {
                    initialValue: get(rowData, 'moduleName'),
                    rules: [
                      {
                        required: true,
                        message: '模块名称不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="标签名称">
                  {getFieldDecorator('refTag', {
                    initialValue: get(rowData, 'refTag'),
                    rules: [
                      {
                        required: true,
                        message: '标签名称不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
                <FormItem label="期望完成时间">
                  {getFieldDecorator('expCompleteTime', {
                    initialValue: expCompleteTime ? moment(expCompleteTime) : null,
                    rules: [
                      {
                        required: true,
                        message: '期望完成时间不能为空',
                      },
                    ],
                  })(
                    <DatePicker
                      allowClear={false}
                      style={{ width: '100%' }}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm:00"
                      disabled
                    />,
                  )}
                </FormItem>
              </Form>
            </ScrollBar>
          </Sider>
          <Content className="auto-height main-content" style={{ paddingLeft: 8 }}>
            <Row className="auto-height" gutter={4}>
              <Col span={tagId ? 12 : 24} className="auto-height">
                <QueueAnim
                  className="auto-height"
                  key="mk-content-anim"
                  forcedReplay={!!tagId}
                  appear={false}
                  animConfig={[
                    { opacity: [1, 0], scaleX: [1, 0.5], translateX: [0, -500] },
                    { opacity: [1, 0], scaleX: [1, 0.5], translateX: [0, 500] },
                  ]}
                >
                  <Card bordered={false} key="tag-content" className="tag-content" title="部署说明">
                    <MdEditorView
                      key="tag-content-md"
                      message={get(rowData, 'remark') || '<span style="color:#999">暂无数据</span>'}
                    />
                  </Card>
                </QueueAnim>
              </Col>
              <Col span={tagId ? 12 : 0} className="auto-height tag-content-box">
                <QueueAnim
                  className="auto-height"
                  key="tag-content-anim"
                  delay={200}
                  animConfig={[
                    { opacity: [1, 0], scale: [1, 1.5] },
                    { opacity: [1, 0], scale: [1, 1.5] },
                  ]}
                >
                  {tagId ? (
                    <Card
                      bordered={false}
                      key="tag-content"
                      className="tag-content"
                      title="标签列表"
                    >
                      <TagList {...tagListPros} />
                    </Card>
                  ) : null}
                </QueueAnim>
              </Col>
            </Row>
          </Content>
        </Layout>
      </ExtModal>
    );
  }
}

export default DeployDetail;
