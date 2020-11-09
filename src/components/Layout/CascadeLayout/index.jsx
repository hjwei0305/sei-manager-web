import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { ExtIcon } from 'suid';
import cls from 'classnames';
import styles from './index.less';

export default class CascadeLayout extends Component {
  state = {
    shrinked: false,
  };

  handleClick = () => {
    const { shrinked } = this.state;
    this.setState({
      shrinked: !shrinked,
    });
  };

  renderChildren = () => {
    const { shrinked } = this.state;
    const { children, title = ['左标题', '右标题'], layout = [10, 14], canShrink } = this.props;
    const [leftTitle, rightTitle] = title;
    const [leftSpan, rightSpan] = layout;
    const bordered = false;

    if (!children) {
      return null;
    }

    return []
      .concat(children)
      .map(child => {
        const { slot, slotClassName } = child.props;
        if (['left', 'right'].includes(slot)) {
          if (slot === 'left') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-col-left', slotClassName)}
                span={shrinked ? 0 : leftSpan}
              >
                <Card title={leftTitle} bordered={bordered}>
                  {child}
                </Card>
              </Col>
            );
          }
          if (slot === 'right') {
            return (
              <Col
                key={slot}
                className={cls('layout-col', 'layout-col-right', slotClassName)}
                span={shrinked ? 24 : rightSpan}
              >
                <Card
                  title={
                    <span>
                      {canShrink ? (
                        <span
                          className={cls({
                            'icon-wrapper': true,
                            shrinked_icon: shrinked,
                          })}
                          onClick={this.handleClick}
                        >
                          {/* tooltip={{title: shrinked ? '展开' : '收缩'}} */}
                          <ExtIcon type={shrinked ? 'menu-unfold' : 'menu-fold'} antd />
                        </span>
                      ) : null}
                      {rightTitle}
                    </span>
                  }
                  bordered={bordered}
                >
                  {child}
                </Card>
              </Col>
            );
          }
        }

        return null;
      })
      .filter(child => !!child);
  };

  render() {
    const { className } = this.props;

    return (
      <Row gutter={8} className={cls(styles['cascade-layout-wrapper'], className)}>
        {this.renderChildren()}
      </Row>
    );
  }
}
