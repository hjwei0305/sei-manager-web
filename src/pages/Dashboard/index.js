import React from 'react';
// import Iframe from '@/layouts/components/Tab/Iframe';
// import { constants } from '@/utils';
import styles from './index.less';

// const { IS_DEVELOPMENT } = constants;

const Dashboard = () => (
  <section className={styles['dashboard-wrapper']}>
    {/* {!IS_DEVELOPMENT ? (
      <Iframe
        visible
        title="dashboard"
        url="/sei-dashboard-web/#/sei-dashboard-web/scene/sei/home"
        id="portal-dashboard"
      />
    ) : null} */}
  </section>
);

export default Dashboard;
