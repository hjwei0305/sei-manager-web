import React, { Suspense } from 'react';
import { get } from 'lodash';
import { Tabs, Card } from 'antd';
import { BannerTitle, PageLoader } from 'suid';
import { FilterView } from '@/components';
import YamlModel from './components/YamlModel';
import ConfigItem from './ConfigItem';
import styles from './Config.less';

const { TabPane } = Tabs;
const AppRelease = React.lazy(() => import('./components/Release'));
const AppCompare = React.lazy(() => import('./components/Compare'));

const Config = ({
  handlerEnvChange,
  envData,
  selectedEnv,
  selectedApp,
  currentTabKey,
  onTabChange,
  onItemRef,
  yamlText,
  yamlTextLoading,
  showRelease,
  handlerClose,
  compareBeforeReleaseData,
  handlerRelease,
  releasing,
  compareLoading,
  showCompare,
  targetCompareEvn,
  compareData,
  saveYaml,
  savingYaml,
}) => {
  const renderTitle = () => {
    return (
      <>
        <BannerTitle title={get(selectedApp, 'name')} subTitle="配置" />
        <FilterView
          style={{ marginRight: 0, marginLeft: 8 }}
          title=""
          iconType=""
          currentViewType={selectedEnv}
          viewTypeData={envData}
          onAction={handlerEnvChange}
          reader={{
            title: 'name',
            value: 'code',
          }}
        />
      </>
    );
  };

  const appReleaseProps = {
    selectedApp,
    showRelease,
    handlerClose,
    handlerRelease,
    compareBeforeReleaseData,
    releasing,
  };

  const appCompareProps = {
    selectedApp,
    selectedEnv,
    targetCompareEvn,
    showCompare,
    handlerClose,
    compareLoading,
    compareData,
  };

  return (
    <Card className={styles['view-box']} bordered={false} title={renderTitle()}>
      <Tabs type="card" activeKey={currentTabKey} onChange={onTabChange} animated={false}>
        <TabPane tab="配置参数" key="appParam" forceRender>
          <ConfigItem onItemRef={onItemRef} />
        </TabPane>
        <TabPane tab="Yaml模式" key="yamlPreview">
          <YamlModel
            loading={yamlTextLoading}
            saveYaml={saveYaml}
            saving={savingYaml}
            selectedEnv={selectedEnv}
            selectedApp={selectedApp}
            yamlText={yamlText}
          />
        </TabPane>
      </Tabs>
      {showRelease ? (
        <Suspense fallback={<PageLoader />}>
          <AppRelease {...appReleaseProps} />
        </Suspense>
      ) : null}
      {showCompare ? (
        <Suspense fallback={<PageLoader />}>
          <AppCompare {...appCompareProps} />
        </Suspense>
      ) : null}
    </Card>
  );
};

export default Config;
