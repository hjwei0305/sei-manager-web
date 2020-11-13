import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import cls from 'classnames';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './View.less';

const { SERVER_PATH } = constants;

class StationView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handlerShowChange = visible => {
    this.setState({ visible });
  };

  renderList = () => {
    const { featureRoleId } = this.props;
    const listCardProps = {
      className: 'role-box',
      bordered: false,
      pagination: false,
      itemField: {
        title: item => (
          <>
            {item.name}
            <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
          </>
        ),
        description: item => item.organizationNamePath,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRole/getAssignedPositionsByFeatureRole`,
        params: {
          featureRoleId,
        },
      },
      showArrow: false,
      showSearch: false,
      customTool: () => null,
    };
    return <ListCard {...listCardProps} />;
  };

  render() {
    const { visible } = this.state;
    const { title, menuId } = this.props;
    return (
      <Popover
        trigger="click"
        placement="rightTop"
        visible={visible}
        key="role-station-view-popover-box"
        destroyTooltipOnHide
        getPopupContainer={() => document.getElementById(menuId)}
        onVisibleChange={v => this.handlerShowChange(v)}
        overlayClassName={cls(styles['view-popover-box'])}
        content={this.renderList()}
      >
        <span className={cls('view-popover-box-trigger')}>{title}</span>
      </Popover>
    );
  }
}

export default StationView;
