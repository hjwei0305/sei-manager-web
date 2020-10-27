import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Dropdown } from 'antd';
import cls from 'classnames';
import * as focus from 'focus-outside';
import styles from './index.less';

export default class HeaderDropdown extends PureComponent {
  static dropdownElm;

  constructor(props) {
    super(props);
    this.dropdownElm = null;
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    if (this.dropdownElm) {
      focus.bind(ReactDOM.findDOMNode(this.dropdownElm), this.handleOutside);
    }
  }

  componentWillUnmount() {
    if (this.dropdownElm) {
      focus.unbind(ReactDOM.findDOMNode(this.dropdownElm), this.handleOutside);
    }
  }

  handleOutside = () => {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 80);
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    const { overlayClassName, ...props } = this.props;
    return (
      <Dropdown
        onVisibleChange={this.handleVisibleChange}
        ref={node => (this.dropdownElm = node)}
        visible={visible}
        overlayClassName={cls(styles.container, overlayClassName)}
        {...props}
      />
    );
  }
}
