import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Button, Input } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;
const { Search } = Input;

class GitlabList extends Component {
  static listCardRef;

  static propTypes = {
    saving: PropTypes.bool,
    saveUserGroup: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      groupItems: [],
    };
  }

  componentDidUpdate(preProps) {
    const { gitlabShow } = this.props;
    if (!isEqual(preProps.gitlabShow, gitlabShow) && !gitlabShow) {
      this.setState({ selectedRowKeys: [], groupItems: [] });
    }
  }

  save = () => {
    const { saveUserGroup, handlerPopoverHide } = this.props;
    const { groupItems } = this.state;
    if (saveUserGroup) {
      saveUserGroup(groupItems, handlerPopoverHide);
    }
  };

  handlerSelectRow = (selectedRowKeys, groupItems) => {
    this.setState({
      selectedRowKeys,
      groupItems,
    });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderCustomTool = () => {
    const { selectedRowKeys } = this.state;
    const { saving } = this.props;
    return (
      <>
        <Button
          type="primary"
          onClick={this.save}
          loading={saving}
          disabled={selectedRowKeys.length === 0}
        >
          {`确定( ${selectedRowKeys.length} )`}
        </Button>
        <Search
          placeholder="输入代码、名称或描述关键字"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 240 }}
        />
      </>
    );
  };

  render() {
    const listCardProps = {
      title: 'Gitlab用户组',
      showSearch: false,
      onSelectChange: this.handlerSelectRow,
      searchProperties: ['description', 'code', 'name'],
      checkbox: true,
      showArrow: false,
      rowKey: 'code',
      itemField: {
        title: item => item.name,
        description: item => item.description || '-',
      },
      store: {
        url: `${SERVER_PATH}/sei-manager/userGroup/getGitlabGroup`,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return <ListCard {...listCardProps} />;
  }
}

export default GitlabList;
