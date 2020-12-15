import React from 'react';
import { Tag } from 'antd';
import { ExtIcon } from 'suid';
import { constants } from '@/utils';

const { JENKINS_STATUS } = constants;

const JenkinsState = ({ state }) => {
  const status = JENKINS_STATUS[state] || {};
  if (status.name === JENKINS_STATUS.BUILDING.name) {
    return (
      <Tag color={status.color}>
        <ExtIcon type="sync" antd spin style={{ marginRight: 4 }} />
        {status.remark || ''}
      </Tag>
    );
  }
  return <Tag color={status.color}>{status.remark || ''}</Tag>;
};

export default JenkinsState;
