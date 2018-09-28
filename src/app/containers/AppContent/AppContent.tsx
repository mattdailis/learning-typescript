import * as React from 'react';

import { HashRouter, NavLink, Route } from 'react-router-dom';

interface ViewType {
  name: string;
  url: string;
  component: React.ComponentType;
}

interface AppContentProps {
  views: ViewType[];
}

interface AppContentState {
  activeView: ViewType;
}

class AppContent extends React.Component<AppContentProps, AppContentState>  {

  constructor(props: any) {
    super(props);
    this.state = {
      activeView: this.props.views[0],
    };
  }

  public render() {
    const { activeView } = this.state;
    const Component = activeView.component;
    return (
      <Component />
    );
  }
}

export default AppContent;
