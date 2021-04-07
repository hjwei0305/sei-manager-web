import React from 'react';
import { Badge } from 'antd';
import { constants } from '@/utils';

const { APPLY_STATUS } = constants;

const ApplyState = ({ item }) => {
  const { approvalStatus, executeAccount, executeUserName } = item;
  const status = APPLY_STATUS[approvalStatus] || {};
  let text = status.remark || '';
  if (executeAccount && executeUserName) {
    text = (
      <span>
        {text}
        <span
          style={{ fontSize: 10, position: 'absolute', bottom: -12, left: 16 }}
        >{`${executeUserName}(${executeAccount})`}</span>
      </span>
    );
  }
  return (
    <>
      <Badge
        color={status.color}
        status={status.name === APPLY_STATUS.PROCESSING.name ? 'processing' : null}
        text={text}
      />
    </>
  );
};

export default ApplyState;
