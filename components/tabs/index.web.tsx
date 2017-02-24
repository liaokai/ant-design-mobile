import React from 'react';
import RcTabs, { TabPane } from 'rc-tabs';
import TabsProps from './PropsType';
import SwipeableTabContent from 'rc-tabs/lib/SwipeableTabContent';
import TabContent from 'rc-tabs/lib/TabContent';
import InkTabBar from 'rc-tabs/lib/InkTabBar';
import SwipeableInkTabBar from 'rc-tabs/lib/SwipeableInkTabBar';
import assign from 'object-assign';

const Tabs = React.createClass<TabsProps, any>({
  statics: {
    TabPane,
  },

  getDefaultProps() {
    return {
      prefixCls: 'am-tabs',
      animated: true,
      swipeable: true,
      tabBarPosition: 'top',
      hammerOptions: {},
      tabBarhammerOptions: {},
      pageSize: 5,
      speed: 8,
      onChange() {},
      onTabClick() {},
    };
  },

  getInitialState() {
    const { activeKey, defaultActiveKey, children } = this.props;
    const initialActiveKey = activeKey || defaultActiveKey || children[0].key;
    return {
      activeTabIndex: children.findIndex(tab => tab.key === initialActiveKey),
    };
  },

  renderTabBar() {
    const { children, animated, speed, pageSize, tabBarhammerOptions } = this.props;
    if (children.length > pageSize) {
      return (
        <SwipeableInkTabBar
          onTabClick={this.handleSwipeTabClick}
          speed={speed}
          pageSize={pageSize}
          hammerOptions={tabBarhammerOptions}
        />
      );
    }
    return <InkTabBar inkBarAnimated={animated} />;
  },

  renderTabContent() {
    const { animated, swipeable, hammerOptions } = this.props;
    return swipeable ? (
      <SwipeableTabContent animated={animated} hammerOptions={hammerOptions} />
    ) : (
      <TabContent animated={animated} />
    );
  },

  handleSwipeTabClick(key) {
    this.setState({
      activeTabIndex: this.props.children.findIndex(tab => tab.key === key),
    });
    this.props.onTabClick(key);
  },

  handleSwipeTabChange(key) {
    this.setState({
      activeTabIndex: this.props.children.findIndex(tab => tab.key === key),
    });
    this.props.onChange(key);
  },

  render() {
    const { children, pageSize } = this.props;
    let newProps = assign({}, this.props);
    if (children.length > pageSize) {
      newProps = assign(newProps, {
        onChange: this.handleSwipeTabChange,
      });
    }
    return (
      <RcTabs
        renderTabBar={this.renderTabBar}
        renderTabContent={this.renderTabContent}
        {...newProps}
      />
    );
  },
});

export default Tabs;
