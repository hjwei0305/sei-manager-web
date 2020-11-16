import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Empty } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import CascadeLayout from '@/components/Layout/CascadeLayout';
import ParentTable from './components/ParentTable';
import QuickCreate from './components/ParentTable/QuickCreate';
import ChildTable from './components/ChildTable';
import styles from './index.less';

@withRouter
@connect(({ appModule, loading }) => ({ appModule, loading }))
class AppModule extends Component {
  hanldeSaveSuccess = () => {
    if (this.appRef) {
      this.appRef.reloadData();
    }
  };

  render() {
    const { appModule, loading } = this.props;
    const { currPRowData, isQuickCreate } = appModule;

    return (
      <PageWrapper loading={loading.global} className={cls(styles['container-box'])}>
        <CascadeLayout
          title={['应用列表', `${currPRowData ? currPRowData.name : ''}`]}
          layout={[6, 18]}
          className={cls({
            hide_ele: isQuickCreate,
          })}
        >
          <ParentTable slot="left" onRef={inst => (this.appRef = inst)} />
          {currPRowData ? (
            <ChildTable slot="right" />
          ) : (
            <Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的数据" />
          )}
        </CascadeLayout>
        {isQuickCreate ? <QuickCreate onSaveSuccess={this.hanldeSaveSuccess} /> : null}
      </PageWrapper>
    );
  }
}

export default AppModule;
