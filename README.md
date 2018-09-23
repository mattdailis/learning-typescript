To develop, use `yarn start` or equivalently `yarn dev`. This does a quick non-optimized build and 
starts a development server with hot module reloading and source maps.

For production, use `yarn build`. 

# Toolchain:
- Package manager: yarn
- Bundler: webpack
- Compiler: Typescript

# Project structure
Eventually, all configuration should go in a /config directory.

## Imports and aliases
webpack, typescript, and jest all allow the definition of aliases for imports. 

For example, if the alias `APP='/app'` is specified, then `import _ from 'APP/components/Hello'` will work.

The point is to minimize the number of relative imports in the project. The policy should be no relative imports more than
one hop away. (Ex: `import _ from './Hello'` is okay. `'import _ from '../Hello'` and `import _ from 'something/Hello'` are not okay)

This policy is subject to change as development actually starts.