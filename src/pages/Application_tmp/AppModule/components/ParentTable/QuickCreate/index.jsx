import React, { Component } from 'react';
import cls from 'classnames';
import { PageHeader, Button } from 'antd';
import { ScrollBar, message } from 'suid';
import { connect } from 'dva';
import WebCreateForm from '../../ChildTable/WebCreateForm';
import JavaCreateForm from '../../ChildTable/JavaCreateForm';
import AppForm from '../Form';
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
        isQuickCreate: false,
      },
    });
  };

  handleSave = () => {
    const { dispatch, onSaveSuccess } = this.props;
    const { types } = this.state;
    const promises = [];
    if (this.appFormRef) {
      promises.push(this.appFormRef.onFormSubmit());
    }
    if (this.webFormRef && types.includes('web')) {
      promises.push(this.webFormRef.onFormSubmit());
    }
    if (this.javaFormRef && types.includes('java')) {
      promises.push(this.javaFormRef.onFormSubmit());
    }

    Promise.all(promises)
      .then(results => {
        const params = { projects: [] };
        results.forEach((it, idx) => {
          if (idx === 0) {
            Object.assign(params, { application: it });
          } else {
            params.projects.push({ ...it, accessToken });
          }
        });
        dispatch({
          type: 'appModule/quickCreate',
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
    const { types } = this.state;

    return (
      <div className={cls(styles.quick_create_container)}>
        <div className="form-header">
          <PageHeader
            ghost={false}
            onBack={this.handleBack}
            title="快速创建应用"
            subTitle="同步创建应用包含的项目"
            extra={[
              <Button key="2" onClick={this.handleBack}>
                取消
              </Button>,
              <Button key="1" type="primary" onClick={this.handleSave}>
                保存
              </Button>,
            ]}
          >
            <AppForm
              onRef={inst => (this.appFormRef = inst)}
              onTypeChange={this.handleTypeChange}
            />
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
