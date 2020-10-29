import React from 'react';
import { Tag } from 'antd';
import { constants } from '@/utils';

const { LEVEL_CATEGORY } = constants;

const LogLevel = ({ item }) => {
  const level = item ? item.level : '-' || '-';
  const evnData = LEVEL_CATEGORY[level];
  if (evnData) {
    return <Tag color={evnData.color}>{evnData.title}</Tag>;
  }
  return level;
};

export default LogLevel;
