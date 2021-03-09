import React from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Drawer, Layout, Row, Col } from 'antd';
import { BannerTitle, ExtIcon, ListLoader } from 'suid';
import styles from './index.less';

const { Content } = Layout;

const AppCompare = ({
  selectedApp,
  selectedEnv,
  targetCompareEvn,
  showCompare,
  handlerClose,
  compareData,
  compareLoading,
}) => {
  const renderMasterTitle = (title, currentEnvName, targetEnvName) => {
    return (
      <>
        {title}
        <span style={{ color: '#029688', marginLeft: 16 }}>{currentEnvName}</span>
        <span style={{ fontSize: 14 }}>(当前)</span>
        <ExtIcon type="swap-right" style={{ margin: '0 4px' }} antd />
        <span style={{ color: '#357bd8' }}>{targetEnvName}</span>
        <span style={{ fontSize: 14 }}>(目标)</span>
      </>
    );
  };

  const renderTitle = () => {
    const title = get(selectedApp, 'name');
    const currentEnvName = get(selectedEnv, 'name');
    const targetEnvName = get(targetCompareEvn, 'name');
    return (
      <>
        <ExtIcon onClick={handlerClose} type="left" className="trigger-back" antd />
        <BannerTitle
          title={renderMasterTitle(title, currentEnvName, targetEnvName)}
          subTitle="比较结果"
        />
      </>
    );
  };

  const renderChangeContent = () => {
    console.log(compareData);
  };

  return (
    <Drawer
      width="100%"
      destroyOnClose
      getContainer={false}
      placement="right"
      visible={showCompare}
      title={renderTitle()}
      className={cls(styles['app-compare-box'])}
      onClose={handlerClose}
      style={{ position: 'absolute' }}
    >
      <Layout className="auto-height">
        <Content className={cls('main-content', 'auto-height')}>
          {compareLoading ? <ListLoader /> : null}
          <Row className={cls('body-content', 'auto-height')}>
            <Col span={12} className="auto-height">
              {renderChangeContent()}
            </Col>
            <Col span={12} className="auto-height">
              bb
            </Col>
          </Row>
        </Content>
      </Layout>
    </Drawer>
  );
};

export default AppCompare;
