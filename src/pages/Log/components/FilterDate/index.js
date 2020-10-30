import React, { PureComponent } from 'react';
import cls from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { get, isEqual, findIndex } from 'lodash';
import { Button, Icon, Menu, PageHeader, message } from 'antd';
import { ExtIcon, ScopeDatePicker } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SEARCH_DATE_PERIOD } = constants;
const { Item } = Menu;

const viewTypeData = Object.keys(SEARCH_DATE_PERIOD).map(key => SEARCH_DATE_PERIOD[key]);
const initCurrentViewType = viewTypeData[0];

class FilterDateView extends PureComponent {
  static dateRef = null;

  static propTypes = {
    onAction: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      endTime: null,
      currentViewType: initCurrentViewType,
      selectedKey: findIndex(viewTypeData, initCurrentViewType),
      menusData: viewTypeData,
      customizeDatePeriod: get(initCurrentViewType, 'name') === SEARCH_DATE_PERIOD.PERIOD.name,
    };
  }

  componentDidUpdate(prevProps) {
    const { currentViewType } = this.state;
    if (!isEqual(prevProps.viewTypeData, viewTypeData)) {
      this.setState({
        menusData: viewTypeData,
        selectedKey: findIndex(viewTypeData, currentViewType),
      });
    }
  }

  dataHandle = (currentViewType, period = {}) => {
    const { onAction } = this.props;
    const newVal = { ...currentViewType, ...period };
    switch (currentViewType.name) {
      case 'THIS_5M':
        newVal.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        newVal.startTime = moment(newVal.endTime)
          .subtract(5, 'minute')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'THIS_30M':
        newVal.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        newVal.startTime = moment(newVal.endTime)
          .subtract(30, 'minute')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'THIS_60M':
        newVal.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        newVal.startTime = moment(newVal.endTime)
          .subtract(1, 'hour')
          .format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'TODAY':
        newVal.startTime = moment().format('YYYY-MM-DD 00:00:00');
        newVal.endTime = moment().format('YYYY-MM-DD 23:59:59');
        break;
      default:
        break;
    }
    if (onAction) {
      onAction(newVal);
    }
  };

  handlerSubmit = () => {
    const { startDate, endDate } = this.dateRef.state;
    const startTime = startDate ? moment(startDate).format('YYYY-MM-DD HH:mm:00') : null;
    const endTime = endDate ? moment(endDate).format('YYYY-MM-DD HH:mm:59') : null;
    if (!startDate || !endDate) {
      this.setState({
        startTime,
        endTime,
      });
      if (!startDate) {
        message.warning('请配置开始时间');
      } else if (!endDate) {
        message.warning('请配置结束时间');
      }
      return;
    }
    const currentViewType = viewTypeData.filter(i => i.name === SEARCH_DATE_PERIOD.PERIOD.name)[0];
    this.setState({
      selectedKey: findIndex(viewTypeData, currentViewType),
      currentViewType,
      startTime,
      endTime,
    });
    this.dataHandle(currentViewType, {
      startTime,
      endTime,
    });
  };

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    const { menusData, selectedKey } = this.state;
    const currentViewType = menusData[e.key];
    const isPeriod = currentViewType.name === SEARCH_DATE_PERIOD.PERIOD.name;
    this.setState({
      selectedKey: isPeriod ? selectedKey : e.key,
      customizeDatePeriod: isPeriod,
      currentViewType,
    });
    if (!isPeriod) this.dataHandle(currentViewType);
  };

  onBack = () => {
    this.setState({
      customizeDatePeriod: false,
    });
  };

  getContent = menus => {
    const { selectedKey, customizeDatePeriod, startTime, endTime } = this.state;
    if (customizeDatePeriod) {
      const scopeDatePickerProps = {
        format: 'YYYY-MM-DD HH:mm',
        showTime: { format: 'HH:mm' },
        value: [startTime, endTime],
        allowClear: true,
      };
      return (
        <PageHeader
          className={cls(styles['pop-search-box'])}
          backIcon={<Icon type="left" />}
          onBack={this.onBack}
          title="指定时间段"
        >
          <ScopeDatePicker ref={ref => (this.dateRef = ref)} {...scopeDatePickerProps} />
          <div className="btn-group">
            <Button type="primary" onClick={this.handlerSubmit}>
              确定
            </Button>
          </div>
        </PageHeader>
      );
    }
    return (
      <Menu
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e)}
        selectedKeys={[`${selectedKey}`]}
      >
        {menus.map((m, index) => {
          return (
            <Item key={index.toString()}>
              {index.toString() === selectedKey.toString() ? (
                <ExtIcon type="check" className="selected" antd />
              ) : null}
              <span className="view-popover-box-trigger">{m.remark}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { menusData } = this.state;
    return <>{this.getContent(menusData)}</>;
  }
}

export default FilterDateView;
