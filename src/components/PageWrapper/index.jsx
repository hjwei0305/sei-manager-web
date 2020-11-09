import React from 'react';
import cls from 'classnames';
import { Spin } from 'antd';
import styles from './index.less';

const PageWrapper = props => {
  const { children, className, loading = false } = props;
  return (
    <div className={cls(styles['sei-page-warpper'], className)}>
      <Spin spinning={loading} wrapperClassName={cls('spin-wrapper')}>
        {children}
      </Spin>
    </div>
  );
};

export default PageWrapper;
