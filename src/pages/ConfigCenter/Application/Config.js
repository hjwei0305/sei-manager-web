import React from 'react';
import { get } from 'lodash';
import { Tabs, Card } from 'antd';
import { BannerTitle } from 'suid';
import { FilterView } from '@/components';
import YamlModel from './components/YamlModel';
import ConfigItem from './ConfigItem';
import styles from './Config.less';

const { TabPane } = Tabs;

const Config = ({
  handlerEnvChange,
  envData,
  selectedEnv,
  selectedApp,
  currentTabKey,
  onTabChange,
  yamlText,
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

  return (
    <Card className={styles['view-box']} bordered={false} title={renderTitle()}>
      <Tabs type="card" activeKey={currentTabKey} onChange={onTabChange} animated={false}>
        <TabPane tab="配置参数" key="appParam" forceRender>
          <ConfigItem />
        </TabPane>
        <TabPane tab="Yaml模式" key="yamlPreview" forceRender>
          <YamlModel yamlText={yamlText} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Config;
