import React from 'react';
import { get } from 'lodash';
import { Tabs, Card } from 'antd';
import { BannerTitle } from 'suid';
import YamlPreview from './components/YamlPreview';
import ConfigItem from './ConfigItem';
import styles from './Config.less';

const { TabPane } = Tabs;

const Config = ({ selectedApp, currentTabKey, onTabChange, yamlText }) => {
  return (
    <Card
      className={styles['view-box']}
      bordered={false}
      title={<BannerTitle title={get(selectedApp, 'name')} subTitle="配置" />}
    >
      <Tabs type="card" activeKey={currentTabKey} onChange={onTabChange} animated={false}>
        <TabPane tab="应用配置参数" key="appParam" forceRender>
          <ConfigItem />
        </TabPane>
        <TabPane tab="YAML模式预览" key="yamlPreview" forceRender>
          <YamlPreview yamlText={yamlText} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Config;
