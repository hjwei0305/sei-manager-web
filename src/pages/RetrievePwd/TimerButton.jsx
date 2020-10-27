import React, { Component } from 'react';
import { Button } from 'antd';

class TimerButton extends Component {
  state = {
    disabled: false,
  };

  getChildren = () => {
    const { children } = this.props;
    const { disabled, count } = this.state;
    if (disabled) {
      return `${count}(s)`;
    }

    return children;
  };

  handleClick = () => {
    const { disabledTime = 60, onClick, beforeClick } = this.props;
    beforeClick().then(() => {
      this.setState({
        disabled: true,
        count: disabledTime,
      });
      if (onClick) {
        onClick();
      }
      clearInterval(this.intervalTimer);
      this.intervalTimer = setInterval(() => {
        const { count } = this.state;
        if (count > 0) {
          this.setState({
            count: count - 1,
          });
        }
      }, 1000);
      setTimeout(() => {
        this.setState({
          disabled: false,
          count: 0,
        });
      }, disabledTime * 1000);
    });
  };

  render() {
    const { children, ...restProps } = this.props;
    const { disabled } = this.state;
    return (
      <Button {...restProps} onClick={this.handleClick} disabled={disabled}>
        {this.getChildren()}
      </Button>
    );
  }
}

export default TimerButton;
