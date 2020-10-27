import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import cls from 'classnames';
import { get } from 'lodash';
import { List } from 'antd';
import styles from './SearchResult.less';

const noop = () => {};

class SearchResult extends PureComponent {
  static propTypes = {
    dataSource: propTypes.array,
    onSelect: propTypes.func,
    searchKeyValue: propTypes.string,
    title: propTypes.string,
  };

  static defaultProps = {
    title: '',
    dataSource: [],
    onSelect: noop,
    searchKeyValue: '',
  };

  handlerSelect = item => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(item);
    }
  };

  renderItemTitle = item => {
    const { searchKeyValue } = this.props;
    const menuTitle = get(item, 'title', '');
    const index = menuTitle.indexOf(searchKeyValue);
    const beforeStr = menuTitle.substr(0, index);
    const afterStr = menuTitle.substr(index + searchKeyValue.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span className="menu-search-value">{searchKeyValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{menuTitle}</span>
      );
    return title;
  };

  render() {
    const { title, dataSource } = this.props;
    return (
      <div className={cls(styles['menu-search-result-box'], 'menu-search')}>
        <div className="title">{title}</div>
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={item => (
            <List.Item key={item.id} onClick={() => this.handlerSelect(item)}>
              <List.Item.Meta
                title={this.renderItemTitle(item)}
                description={get(item, 'urlPath', '').slice(1)}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default SearchResult;
