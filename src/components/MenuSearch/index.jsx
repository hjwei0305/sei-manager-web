import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { noop, groupBy, debounce, trim, orderBy, take } from 'lodash';
import { Input, Popover, Empty } from 'antd';
import { ScrollBar, utils } from 'suid';
import { constants, userInfoOperation } from '@/utils';
import SearchResult from './SearchResult';
import styles from './index.less';

const { storage } = utils;

const { RECENT_MENUS_KEY } = constants;
const { getCurrentUser } = userInfoOperation;

const { Search } = Input;

export default class MenuSearch extends PureComponent {
  static quickSearch;

  static propTypes = {
    /** 外部样式 */
    // className: propTypes.string,
    /** 菜单数据 */
    data: propTypes.array,
    /** 选中后回调事件 */
    onSelect: propTypes.func,
    /** 显示字段 */
    showField: propTypes.string,
    /** 搜索占位字符串 */
    placeholder: propTypes.string,
  };

  static defaultProps = {
    // className: '',
    data: [],
    showField: 'title',
    onSelect: noop,
    placeholder: '',
  };

  constructor(props) {
    super(props);
    this.quickSearch = debounce(this.handlerSearch, 500);
    this.state = {
      visible: false,
      /** 过滤后数据 */
      filterData: [],
      searchValue: '',
    };
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  handlerSearchChange = v => {
    this.setState({ searchValue: trim(v) }, this.handlerSearch);
  };

  handlerSelect = item => {
    const { onSelect } = this.props;
    this.setState(
      {
        visible: false,
        searchValue: '',
        filterData: [],
      },
      () => {
        onSelect(item);
      },
    );
  };

  handlerSearch = () => {
    const { searchValue } = this.state;
    const { showField, data } = this.props;
    const filterData = searchValue
      ? data.filter(item => item[showField].includes(searchValue))
      : [];
    this.setState({
      filterData,
      visible: true,
    });
  };

  handlerCloseResult = () => {
    setTimeout(() => {
      this.setState({
        visible: false,
        searchValue: '',
        filterData: [],
      });
    }, 200);
  };

  // 获取用户使用过的菜单
  getUserRecentMeuns = () => {
    const userInfo = getCurrentUser();
    let menus = [];
    if (userInfo && userInfo.userId) {
      const tempMenus = [];
      const key = `${RECENT_MENUS_KEY}_${userInfo.userId}`;
      const recentMenus = storage.localStorage.get(key) || {};
      Object.keys(recentMenus).forEach(menyKey => {
        const tmpMenu = recentMenus[menyKey];
        tempMenus.push(tmpMenu);
      });
      const orderMenus = orderBy(tempMenus, ['date'], 'desc');
      menus = take(orderMenus, 10);
    }
    return menus;
  };

  renderEmptyText = () => {
    const text = '暂时没有数据';
    const { searchValue } = this.state;
    if (searchValue) {
      return text;
    }
    return (
      <>
        <span style={{ color: '#ccc' }}>提示: 输入菜单关键字</span>
        <br />
        {text}
      </>
    );
  };

  renderDataList = () => {
    const { filterData, searchValue } = this.state;
    if (filterData && filterData.length) {
      const menuMaps = groupBy(filterData, 'rootName');
      const mapKeys = Object.keys(menuMaps);
      return mapKeys.map(mapKey => {
        const searchResultProps = {
          title: mapKey,
          dataSource: menuMaps[mapKey],
          onSelect: this.handlerSelect,
          searchKeyValue: searchValue,
        };
        return <SearchResult key={mapKey} {...searchResultProps} />;
      });
    }
    const menus = this.getUserRecentMeuns();
    if (searchValue || menus.length === 0) {
      return (
        <Empty
          image={null}
          imageStyle={{ color: 'rgba(255, 255, 255, 0.65)' }}
          description={this.renderEmptyText()}
        />
      );
    }
    const searchResultProps = {
      title: '最近使用',
      dataSource: menus,
      onSelect: this.handlerSelect,
    };
    return <SearchResult {...searchResultProps} />;
  };

  render() {
    const { placeholder } = this.props;
    const { visible, searchValue } = this.state;
    return (
      <>
        <Popover
          overlayClassName={styles['popver-wrapper']}
          placement="bottom"
          content={
            <div className="menu-search-popver-content">
              <ScrollBar>{this.renderDataList()}</ScrollBar>
            </div>
          }
          trigger="click"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Search
            allowClear
            value={searchValue}
            placeholder={placeholder}
            onSearch={this.handlerSearch}
            onChange={e => this.handlerSearchChange(e.target.value)}
            onPressEnter={this.handlerSearch}
            onBlur={this.handlerCloseResult}
          />
        </Popover>
      </>
    );
  }
}
