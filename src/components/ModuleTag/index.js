import React from 'react';
import { Tag } from 'antd';
import styles from './index.less';

const ModuleTag = ({ moduleItem, style = {} }) => {
  let color = 'blue';
  let desc = <span className="tag web">前端</span>;
  if (moduleItem.nameSpace) {
    color = 'cyan';
    desc = <span className="tag api">后端</span>;
  }
  let tag = <span className="tp prd">产品</span>;
  if (moduleItem.type.indexOf('PROJECT') !== -1) {
    tag = <span className="tp sec">二开</span>;
  }
  return (
    <Tag color={color} className={styles['module-tag-box']} style={style}>
      {desc}
      {tag}
    </Tag>
  );
};

export default ModuleTag;
