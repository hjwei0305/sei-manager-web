import React from 'react';
import { Badge } from 'antd';
import { constants } from '@/utils';

const { APPLY_STATUS } = constants;

const ApplyState = ({ state }) => {
  const status = APPLY_STATUS[state] || {};
  return (
    <Badge
      color={status.color}
      status={status.name === APPLY_STATUS.PROCESSING.name ? 'processing' : null}
      text={status.remark || ''}
    />
  );
};

export default ApplyState;
