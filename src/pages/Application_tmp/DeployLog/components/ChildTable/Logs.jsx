import React, { Component } from 'react';
import { Drawer, Steps, Descriptions, Tag } from 'antd';
import { ScrollBar, ListLoader } from 'suid';
import { get } from 'lodash';
import cls from 'classnames';
import { findLogById } from '../../service';
import styles from './logs.less';

const { Step } = Steps;

const buildSteps = {
  release: [
    {
      title: '拉取beta镜像',
      description: 'Pull Beta Image',
    },
    {
      title: '生成生产镜像',
      description: 'Tag Release Image',
    },
    {
      title: '推送生产镜像',
      description: 'Push Release Image',
    },
    {
      title: '移除本地镜像',
      description: 'Remove Local Image',
    },
    {
      title: '部署生产镜像',
      description: 'Deploy Project',
    },
  ],
  beta: [
    {
      title: '获取部署源码',
      description: 'Pre Git',
    },
    {
      title: '安装构建依赖',
      description: 'Install Dependency Package',
    },
    {
      title: '构建应用',
      description: 'Build Project',
    },
    {
      title: '产生部署镜像',
      description: 'Generate Image',
    },
    {
      title: '部署测试镜像',
      description: 'Deploy Project',
    },
  ],
  dev: [
    {
      title: '获取部署源码',
      description: 'Pre Git',
    },
    {
      title: '安装构建依赖',
      description: 'Install Dependency Package',
    },
    {
      title: '构建应用',
      description: 'Build Project',
    },
    {
      title: '产生部署镜像',
      description: 'Generate Image',
    },
    {
      title: '部署测试镜像',
      description: 'Deploy Project',
    },
  ],
};

const reg = {
  dev: /(Pre Git)|(Install Dependency Package)|(Build Project)|(Generate Image)|(Deploy Project)/g,
  beta: /(Pre Git)|(Install Dependency Package)|(Build Project)|(Generate Image)|(Deploy Project)/g,
  release: /(Pull Beta Image)|(Tag Release Image)|(Push Release Image)|(Remove Local Image)|(Deploy Project)/g,
};

class Logs extends Component {
  state = {
    buildLog: '',
    deploymentStatus: 0,
    jobItem: null,
  };

  componentDidMount() {
    const { deployLog, project } = this.props;
    const jobItems = get(project, 'deployJob.deployJobItems', null);
    if (jobItems) {
      let jobItem = null;
      jobItems.forEach(it => {
        if (it.deployEnv === 'dev') {
          jobItem = it;
        }
      });

      this.setState({
        jobItem,
      });
    }
    if (deployLog) {
      this.getLogs(0);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.logref);
  }

  findLogById = () => {
    const { deployLog } = this.props;
    return findLogById({ id: deployLog.id });
  };

  getLogs = (time = 2000) => {
    this.logref = setTimeout(() => {
      this.findLogById().then(result => {
        const { success, data } = result;
        if (success) {
          const { deploymentStatus, buildLog } = data;
          this.setState(
            {
              buildLog: deploymentStatus === 1 ? '部署排队中' : buildLog,
              deploymentStatus,
            },
            () => {
              if (this.scrollBarRef) {
                this.scrollBarRef.scrollTop = 100000;
              }
            },
          );
          if (deploymentStatus === 1 || deploymentStatus === 2) {
            this.getLogs();
          }
        }
      });
    }, time);
  };

  getHeader = () => {
    const { jobItem } = this.state;
    const { project } = this.props;
    const jobName = get(project, 'deployJob.name', '');
    const jobItemName = get(jobItem, 'name', '');
    const deployEnv = get(jobItem, 'deployEnv', '');

    return (
      <Descriptions column={3}>
        <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
        <Descriptions.Item label="项目描述">{project.description}</Descriptions.Item>
        <Descriptions.Item label="项目分类">{project.type}</Descriptions.Item>
        <Descriptions.Item label="项目分组">{project.groupName}</Descriptions.Item>
        <Descriptions.Item label="项目地址">{project.gitUrl}</Descriptions.Item>
        {/* <Descriptions.Item label="分支描述">{deployLog.description}</Descriptions.Item> */}
        <Descriptions.Item label="部署分支">
          <Tag color="green">dev</Tag>
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

  getStepStatus = () => {
    const { deployLog } = this.props;
    if (deployLog) {
      const { buildLog = '' } = this.state;
      const matchReg = (buildLog || '').match(reg.dev) || [];
      const currBuildSteps = [];
      matchReg.forEach(step => {
        if (step && !currBuildSteps.includes(step)) {
          currBuildSteps.push(step);
        }
      });

      return currBuildSteps;
    }

    return [];
  };

  render() {
    const { visible, onClose } = this.props;
    const { buildLog, deploymentStatus } = this.state;
    return (
      <Drawer title="实时日志" width="100%" visible={visible} onClose={onClose} destroyOnClose>
        <div className={cls(styles['log-wrapper'])}>
          <div className={cls('header')}>{this.getHeader()}</div>
          <div className={cls('build-step')}>
            {deploymentStatus !== 0 ? (
              <Steps>
                {buildSteps.dev.map(({ title, description }, idx) => {
                  const currBuildSteps = this.getStepStatus();
                  const len = currBuildSteps.length;
                  let status = 'wait';
                  if (idx < len - 1 && idx >= 0) {
                    status = 'finish';
                  }

                  if (idx === len - 1) {
                    status = 'process';
                    if (deploymentStatus === 3) {
                      status = 'error';
                    }

                    if (deploymentStatus === 4) {
                      status = 'finish';
                    }
                  }
                  return (
                    <Step key={title} status={status} title={title} description={description} />
                  );
                })}
              </Steps>
            ) : null}
          </div>
          <div className={cls('logs-content')}>
            <ScrollBar containerRef={inst => (this.scrollBarRef = inst)}>
              <pre>{buildLog}</pre>
              {deploymentStatus === 1 || deploymentStatus === 2 ? <ListLoader /> : null}
            </ScrollBar>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default Logs;
