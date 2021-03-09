import React from 'react';
import { Tag } from 'antd';
import { constants } from '@/utils';

const { LEVEL_CATEGORY } = constants;

const LogLevel = ({ item }) => {
  const level = item ? item.level : '-' || '-';
  const envData = LEVEL_CATEGORY[level];
  if (envData) {
    return <Tag color={envData.color}>{envData.title}</Tag>;
  }
  return level;
};

export default LogLevel;
