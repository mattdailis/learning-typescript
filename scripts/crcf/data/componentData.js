function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Creates default React component
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactComponent(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import React, { Component } from 'react';

class ${name} extends Component {
  render() {
    return (
      <div>
        ${name}
      </div>
    );
  }
}

export default ${name};
  `;
}

/**
 * Creates React stateless functional component
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactFunctionalComponent(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import * as React from 'react';

const ${name} = () => {
  return (
    <div>
      ${name}
    </div>
  );
};

export default ${name};\n`;
}

/**
 * Creates default React Native component
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactNativeComponent(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import React, { Component } from 'react';
  import { View, Text } from 'react-native';

class ${name} extends Component {
  render() {
    return (
      <View>
        <Text>${name}</Text>
      </View>
    );
  }
}

export default ${name};\n`;
}

/**
 * Creates default Typescript React Native component
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createTypeScriptReactNativeComponent(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import * as React from 'react';
  import { View, Text } from 'react-native';

class ${name} extends React.Component<any, any>  {
  public render() {
    return (
      <View>
        <Text>${name}</Text>
      </View>
    );
  }
}

export default ${name};\n`;
}

/**
 * Creates default Typescript React component
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createTypeScriptReactComponent(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import * as React from 'react';

class ${name} extends React.Component<any, any>  {
  public render() {
    return (
      <div>
        ${name}
      </div>
    );
  }
}

export default ${name};\n`;
}

/**
 * Creates default React component with prop types
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactComponentWithProps(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ${name} extends Component {
  render() {
    return (
      <div>
        ${name}
      </div>
    );
  }
}

${name}.propTypes = {

};

export default ${name};
  `;
}

/**
 * Creates React stateless functional component with prop types
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactFunctionalComponentWithProps(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import React from 'react';
import PropTypes from 'prop-types';

const ${name} = () => {
  return (
    <div>
      ${name}
    </div>
  );
}

${name}.propTypes = {

};

export default ${name};
  `;
}

/**
 * Creates default index file
 *
 * @param {String} componentName - Component name
 * @param {Boolean} upperCase - If true then capitalize first letter
 * @returns {String}
 */
function createIndex(componentName, upperCase) {
  return `export { default } from './${
    upperCase === true ? capitalizeFirstLetter(componentName) : componentName
  }';\n`;
}

/**
 * Creates index file includes all folder
 *
 * @param {Array} folders - folders array
 * @returns {String}
 */
function createIndexForFolders(folders) {
  return `${folders
    .map(folderName => `import ${folderName} from './${folderName}' \n`)
    .join('')}export {
    ${folders
    .map((folderName, index) => {
      if (index === folders.length - 1) return folderName;

      return `${folderName}, \n`;
    })
    .join('')}
}`;
}

/**
 * Creates default React Native component with prop types
 *
 * @param {String} componentName - Component name
 * @returns {String}
 */
function createReactNativeComponentWithProps(componentName) {
  const name = capitalizeFirstLetter(componentName);

  return `import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

class ${name} extends Component {
  render() {
    return (
      <View>
        <Text>${name}</Text>
      </View>
    );
  }
}

${name}.propTypes = {

};

export default ${name};
  `;
}
/**
 * Creates default test file for component
 *
 * @param {String} componentName - Component name
 * @param {Boolean} upperCase - If true then capitalize first letter
 * @param {Boolean} isTypeScript - Boolean check for Typescript
 * @returns {String}
 */
function createTest(componentName, upperCase, isTypeScript) {
  const componentNameUpperCase = capitalizeFirstLetter(componentName);

  return `import ${isTypeScript ? '* as' : ''} React from 'react';
import * as ShallowRenderer from 'react-test-renderer/shallow';
import ${componentNameUpperCase} from './${
  upperCase === true ? componentNameUpperCase : componentName
}';

describe('<${componentNameUpperCase} />', () => {
  test('renders', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<${componentNameUpperCase} />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
  });
});\n`;
}

module.exports = {
  createReactComponent,
  createReactFunctionalComponent,
  createReactNativeComponent,
  createTypeScriptReactComponent,
  createTypeScriptReactNativeComponent,
  createReactComponentWithProps,
  createReactFunctionalComponentWithProps,
  createReactNativeComponentWithProps,
  createIndex,
  createIndexForFolders,
  createTest,
};
