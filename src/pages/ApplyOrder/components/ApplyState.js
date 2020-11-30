import React from 'react';
import { Tag } from 'antd';
import { constants } from '@/utils';

const { APPLY_STATUS } = constants;

const ApplyState = ({ state }) => {
  const status = APPLY_STATUS[state] || {};
  return <Tag color={status.color}>{status.remark || ''}</Tag>;
};

export default ApplyState;
