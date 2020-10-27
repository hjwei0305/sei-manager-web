import React from 'react';
import TabPane from './TabPane';
import TabHeader from './TabHeader';
import styles from './index.less';

class Tab extends React.Component {
  handleReload = () => {
    const { activedKey } = this.props;
    this.tabPaneRef.reload(activedKey);
  };

  render() {
    const { tabData, activedKey, onCloseTab, onToggleTab, children } = this.props;

    return (
      <div className={styles['content-layout-wrapper']}>
        <header className="content-tabs-wrapper">
          <TabHeader
            data={tabData}
            activedKey={activedKey}
            onClose={onCloseTab}
            onChange={onToggleTab}
            onReload={this.handleReload}
          />
        </header>
        <content className="content-tabpane-warpper">
          {children || (
            <TabPane
              data={tabData}
              activedKey={activedKey}
              ref={inst => (this.tabPaneRef = inst)}
            />
          )}
        </content>
      </div>
    );
  }
}

Tab.TabHeader = TabHeader;
Tab.TabPane = TabPane;

export default Tab;
