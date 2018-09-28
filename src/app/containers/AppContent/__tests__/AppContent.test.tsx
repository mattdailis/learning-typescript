import * as React from 'react';
import * as ShallowRenderer from 'react-test-renderer/shallow';
import AppContent from '../AppContent';

const views = [{
  component: () => <div>Component</div>,
  name: 'harold',
  url: 'www',
}];

describe('<AppContent />', () => {
  test('renders', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<AppContent views={views} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});
