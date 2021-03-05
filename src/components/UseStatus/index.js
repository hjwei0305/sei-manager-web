import React from 'react';
import { Tag } from 'antd';
import { constants } from '@/utils';

const { USER_STATUS } = constants;
const UseStatus = ({ status }) => {
  const us = USER_STATUS[status];
  if (us) {
    return (
      <Tag style={{ marginLeft: 4 }} color={us.color}>
        {us.title}
      </Tag>
    );
  }
  return <span style={{ marginLeft: 4 }}>-</span>;
};

export default UseStatus;
