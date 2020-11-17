import React, { Component } from 'react';
import cls from 'classnames';
import { PageHeader, Button, Descriptions, Checkbox } from 'antd';
import { ScrollBar, message } from 'suid';
import { connect } from 'dva';
import WebCreateForm from '../WebCreateForm';
import JavaCreateForm from '../JavaCreateForm';
import styles from './index.less';

const accessToken = '59b1ca687d160740156091a5cf853408634b72bd98db4942da1be1647fad0b8a';

@connect(({ appModule }) => ({ appModule }))
class QucikCreate extends Component {
  state = {
    types: ['web', 'java'],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appModule/getGroups',
      payload: {
        accessToken,
      },
    });
  }

  handleTypeChange = types => {
    this.setState({
      types,
    });
  };

  handleBack = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'appModule/updatePageState',
      payload: {
        isQuickCreateChild: false,
      },
    });
  };

  handleSave = () => {
    const { dispatch, onSaveSuccess, appModule } = this.props;
    const { currPRowData } = appModule;
    const { types } = this.state;
    const promises = [];
    if (this.webFormRef && types.includes('web')) {
      promises.push(this.webFormRef.onFormSubmit());
    }
    if (this.javaFormRef && types.includes('java')) {
      promises.push(this.javaFormRef.onFormSubmit());
    }

    Promise.all(promises)
      .then(results => {
        const params = { applicationId: currPRowData.id, projects: [] };
        results.forEach(it => {
          params.projects.push({ ...it, accessToken });
        });
        dispatch({
          type: 'appModule/quickCreateChild',
          payload: params,
        }).then(result => {
          const { success, message: msg } = result || {};
          if (success) {
            message.success(msg);
            this.handleBack().then(() => {
              if (onSaveSuccess) {
                onSaveSuccess();
              }
            });
          }
        });
      })
      .catch(() => {
        message.error('请在必填项中，输入值后再次保存');
      });
  };

  render() {
    const { appModule } = this.props;
    const { currPRowData } = appModule;
    const { types } = this.state;

    return (
      <div className={cls(styles.quick_create_container)}>
        <div className="form-header">
          <PageHeader
            ghost={false}
            onBack={this.handleBack}
            title="快速创建应用项目"
            extra={[
              <Button key="2" onClick={this.handleBack}>
                取消
              </Button>,
              <Button key="1" type="primary" onClick={this.handleSave}>
                保存
              </Button>,
            ]}
          >
            <Descriptions>
              <Descriptions.Item label="应用代码">{currPRowData.code}</Descriptions.Item>
              <Descriptions.Item label="应用名称">{currPRowData.name}</Descriptions.Item>
              <Descriptions.Item label="项目类型">
                <Checkbox.Group
                  value={types}
                  options={[
                    {
                      label: '前端',
                      value: 'web',
                    },
                    {
                      label: '后端',
                      value: 'java',
                    },
                  ]}
                  onChange={this.handleTypeChange}
                />
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </div>
        <div className="form-items">
          {types.includes('web') ? (
            <div className="form-item">
              <ScrollBar>
                <WebCreateForm onRef={inst => (this.webFormRef = inst)} />
              </ScrollBar>
            </div>
          ) : null}
          {types.length === 2 ? <div className="form-item-space" /> : null}
          {types.includes('java') ? (
            <div className="form-item">
              <ScrollBar>
                <JavaCreateForm onRef={inst => (this.javaFormRef = inst)} />
              </ScrollBar>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default QucikCreate;
