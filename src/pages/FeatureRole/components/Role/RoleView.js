import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Popover } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import { BannerTitle } from '@/components';
import styles from './View.less';

const { SERVER_PATH } = constants;

class RoleView extends PureComponent {
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
    const { feature } = this.props;
    const listCardProps = {
      className: 'role-box',
      title: <BannerTitle title={feature.name} subTitle="功能角色分布" />,
      bordered: false,
      pagination: false,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRoleFeature/getParentsFromChildId`,
        params: {
          childId: feature.id,
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
    return (
      <Popover
        trigger="click"
        placement="rightTop"
        visible={visible}
        key="role-view-popover-box"
        destroyTooltipOnHide
        onVisibleChange={v => this.handlerShowChange(v)}
        overlayClassName={cls(styles['view-popover-box'])}
        content={this.renderList()}
      >
        <ExtIcon
          className={cls('view-popover-box-trigger')}
          type="security-scan"
          antd
          tooltip={{ title: '查看角色分布' }}
        />
      </Popover>
    );
  }
}

export default RoleView;
