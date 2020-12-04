import React from 'react';
import { Tag } from 'antd';
import { constants } from '@/utils';

const { JENKINS_STATUS } = constants;

const JenkinsState = ({ state }) => {
  const status = JENKINS_STATUS[state] || {};
  return <Tag color={status.color}>{status.remark || ''}</Tag>;
};

export default JenkinsState;
