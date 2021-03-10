import React, { Suspense, useState } from 'react';
import { get } from 'lodash';
import { Tabs, Card, Button, Popover } from 'antd';
import { BannerTitle, PageLoader, ListCard } from 'suid';
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
  releaseLoading,
  handlerShowRelease,
  handlerClose,
  handlerShowCompare,
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
  const [showCompareEvn, setShowCompareEvn] = useState(0);
  const renderTitle = () => {
    return (
      <>
        <BannerTitle title={get(selectedApp, 'name')} subTitle="配置" />
      </>
    );
  };

  const renderComparetargetEnvList = () => {
    const dataSource = envData.filter(env => selectedEnv && env.code !== selectedEnv.code);
    const listProps = {
      searchProperties: ['code', 'remark'],
      showArrow: false,
      pagination: false,
      showSearch: false,
      customTool: () => null,
      dataSource,
      itemField: {
        title: item => item.code,
        description: item => item.name,
      },
      onSelectChange: (_keys, items) => {
        handlerShowCompare(items[0]);
        setShowCompareEvn(false);
      },
    };
    return (
      <div className="env-box">
        <ListCard {...listProps} />
      </div>
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

  const renderExtra = () => {
    return (
      <>
        <FilterView
          style={{ marginRight: 16 }}
          currentViewType={selectedEnv}
          viewTypeData={envData}
          onAction={handlerEnvChange}
          reader={{
            title: 'name',
            value: 'code',
          }}
        />
        <Button loading={releaseLoading} onClick={handlerShowRelease}>
          发布
        </Button>
        <Popover
          overlayClassName={styles['compare-popover-box']}
          destroyTooltipOnHide
          trigger="click"
          placement="rightTop"
          onVisibleChange={visible => setShowCompareEvn(visible)}
          visible={showCompareEvn}
          content={renderComparetargetEnvList()}
          title="目标环境"
        >
          <Button>比较</Button>
        </Popover>
      </>
    );
  };

  return (
    <Card
      className={styles['view-box']}
      extra={renderExtra()}
      bordered={false}
      title={renderTitle()}
    >
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
