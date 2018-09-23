To develop, use `yarn start` or equivalently `yarn dev`. This does a quick non-optimized build and 
starts a development server with hot module reloading and source maps.

For production, use `yarn build`. 

# Toolchain:
- Package manager: yarn
- Bundler: webpack
- Compiler: Typescript
- Linter: TSLint (TODO)

# Project structure
Eventually, all configuration should go in a /config directory.

## Imports and aliases
webpack, typescript, and jest all allow the definition of aliases for imports. 

For example, if the alias `APP='/app'` is specified, then `import _ from 'APP/components/Hello'` will work.

The point is to minimize the number of relative imports in the project. The policy should be no relative imports more than
one hop away. (Ex: `import _ from './Hello'` is okay. `'import _ from '../Hello'` and `import _ from 'something/Hello'` are not okay)

This policy is subject to change as development actually starts.

For now, the aliases defined are `@Components` and `@Containers`

## Adding new Components
Every component must have its own folder. The structure of this folder is as follows:

    src/app/components/
    ├── Hello
    │   ├── Hello.tsx
    │   └── index.tsx

TODO figure out where tests should go. Options are a `Hello.test.tsx` file, or a `__tests__` folder in the `Hello` directory.

## Views, Containers, Components
A *Component* is a React _Stateless Functional Component_. This means it is defined as an anonyous function that takes props as input and returns
another react component. It will be styled using `styled-components` and will contain only the logic required to render itself correctly.

A *Container* is an ES6 class extending `React.Component`. It will do any business logic or state maintenance as necessary and pass this information
down to one or more (TODO should this just be one?) components. 

A *View* is a concept from *Single-Page-Applications* that is a _Stateless Functional Component_ (TODO is this true?) that defines the layout of some
number of containers and components in a page.

# Routing and State management
This project will be a *Single-Page-Application* with simulated routing. This means that the entire website is loaded from the get-go, and
navigation inside it is merely updating React views. 

TODO Do we want redux? Or GraphQL? Or something else?

# Styling
TODO All styling will be done using the `styled-components` library. There will be no `.css` or `.sass` files. The reasoning is that `styled-components` provides
a hierarchy for the styles based on components. There are no weird global behaviors as would normally occur with css. The `styled-components` library still
allows you to write arbitrary css, so this is not limiting in any way.

# TODO How to use Typescript in all of this