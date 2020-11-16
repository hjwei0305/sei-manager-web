import React, { Component } from 'react';
import { Drawer, Descriptions, Button, Tag } from 'antd';
import { get } from 'lodash';

class DeployDrawer extends Component {
  state = {
    jobItem: null,
  };

  componentDidMount() {
    const { getJobItems, data } = this.props;
    const versionType = get(data, 'tag.versionType', '');
    if (getJobItems) {
      getJobItems().then(result => {
        const { data: jobItems, success } = result;
        if (success) {
          let jobItem = null;
          jobItems.forEach(it => {
            if (versionType === 'beta' && it.deployEnv === 'test') {
              jobItem = it;
            }

            if (versionType === 'release' && it.deployEnv === 'prod') {
              jobItem = it;
            }
          });

          this.setState({
            jobItem,
          });
        }
      });
    }
  }

  getHeader = () => {
    const { jobItem } = this.state;
    const { data } = this.props;
    const project = get(data, 'project', {});
    const tag = get(data, 'tag', {}) || {};
    const jobName = get(project, 'deployJob.name', '');
    const jobItemName = get(jobItem, 'name', '');
    const deployEnv = get(jobItem, 'deployEnv', '');

    return (
      <Descriptions column={1}>
        <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
        <Descriptions.Item label="项目描述">{project.description}</Descriptions.Item>
        <Descriptions.Item label="项目分类">{project.type}</Descriptions.Item>
        <Descriptions.Item label="项目分组">{project.groupName}</Descriptions.Item>
        <Descriptions.Item label="项目地址">{project.gitUrl}</Descriptions.Item>
        <Descriptions.Item label="分支描述">{tag.description}</Descriptions.Item>
        <Descriptions.Item label="部署分支">
          <Tag color="green">{tag.name}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="部署任务">
          <Tag color={jobName ? 'green' : 'red'}>{jobName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="部署任务项">
          <Tag color={jobItemName ? 'green' : 'red'}>{jobItemName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="部署环境">
          <Tag color={deployEnv ? 'green' : 'red'}>{deployEnv}</Tag>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  handleDeploy = () => {
    const { jobItem } = this.state;
    const { onDeploy, data } = this.props;
    const { project, tag } = data;
    if (onDeploy) {
      onDeploy({
        tagId: tag.id,
        jobName: jobItem.name,
        parameters: {
          PROJECT_NAME: project.name,
          PROJECT_VERSION: '0.0.1',
          PROJECT_GIT_PATH: project.gitUrl,
          BETA_VERSION: tag.refTag,
          RELEASE_VERSION: tag.name,
          // BRANCH: 'dev',
          BRANCH: tag.name,
        },
      });
    }
  };

  render() {
    const { onClose, visible, isSaving } = this.props;

    return (
      <Drawer title="部署" destroyOnClose width={400} onClose={onClose} visible={visible}>
        {this.getHeader()}
        <Button loading={isSaving} type="primary" onClick={this.handleDeploy}>
          部署
        </Button>
      </Drawer>
    );
  }
}

export default DeployDrawer;
