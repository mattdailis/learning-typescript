import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AppContent from '@Containers/AppContent';

const views = [{
  component: () => <div>Component</div>,
  name: 'harold',
  url: 'www',
}];

ReactDOM.render(<AppContent views={views} />,
document.getElementById('root'));
