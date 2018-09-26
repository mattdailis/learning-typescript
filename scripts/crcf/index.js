#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const logger = require('./logger');
const fs = require('./utils/fileHelpers');
const {
  createReactFunctionalComponent,
  createTypeScriptReactComponent,
  createTypeScriptReactNativeComponent,
  createIndex,
  createTest,
} = require('./data/componentData');
const stringHelper = require('./utils/stringHelper');
const { getComponentName, getComponentParentFolder } = require('./utils/componentsHelpers.js');
const removeOptionsFromArgs = require('./utils/removeOptionsFromArgs');
const createMultiIndex = require('./utils/createMultiIndex');
const logComponentTree = require('./utils/logComponentTree');
const validateArguments = require('./utils/validateArguments');

// Root directory
const ROOT_DIR = process.cwd();

// Grab provided args
let [, , ...args] = process.argv;

function list(val) {
  return val.split(',');
}

// Set command line interface options for cli
program
  .version('0.1.0')
  .option('--notest', 'No test file')
  .option('--reactnative', 'Creates React Native components')
  .option('--createindex', 'Creates index.js file for multple component imports')
  .option('-f, --functional', 'Creates React stateless functional component')
  .option('-u, --uppercase', 'Component files start on uppercase letter')
  .option('--dir <dir>', 'Define a root directory for the new component folder', '.')
  .option('--name <name>', 'The names of the component to be generated', list)
  .parse(process.argv);

// Remove Node process args options
args = program.args//removeOptionsFromArgs(args);

/**
 * Creates files for component
 *
 * @param {String} componentName - Component name
 * @param {String} componentPath - File system path to component
 */
function createFiles(componentName, componentPath) {
  const {
    reactnative, notest, uppercase, functional,
  } = program;

  return new Promise((resolve) => {
    const isNative = reactnative;
    // File extension
    const ext = 'tsx';
    const indexFile = `index.${ext}`;
    let name = componentName;
    const componentFileName = `${name}.${ext}`;
    // file names to create
    const files = [indexFile, componentFileName];

    if (!notest) {
      files.push(`${name}.test.${ext}`);
    }

    if (uppercase) {
      name = stringHelper.capitalizeFirstLetter(name);

      for (let i = 0; i < files.length; i += 1) {
        if (i !== 0) {
          files.splice(i, 1, stringHelper.capitalizeFirstLetter(files[i]));
        }
      }
    }

    // Create component folder
    fs.createDirectories(componentPath)
      .then(() => {
        // Create index.js
        const promises = [];

        for (let i = 0; i < files.length; i += 1) {
          const file = files[i];
          const filePath = path.join(componentPath, file);
          let data = '';

          if (file === indexFile) {
            data = createIndex(name, uppercase);
            promises.push(
              fs.writeFileAsync(
                filePath,
                data
              ),
            );
          } else if (file === `${name}.${ext}`) {
            if (functional) {
              data = createReactFunctionalComponent(name);
            } else { // Typescript
              data = isNative
                ? createTypeScriptReactNativeComponent(name)
                : createTypeScriptReactComponent(name);
            }
            promises.push(
              fs.writeFileAsync(
                filePath,
                data
              ),
            );
          } else if (file.indexOf(`.test.${ext}`) > -1) {
            data = createTest(
              name,
              uppercase,
              true, // Typescript
            );

            if (!notest) {
              promises.push(
                fs.writeFileAsync(
                  filePath,
                  data
                ),
              );
            }
          }
        }

        Promise.all(promises).then(() => resolve(files.map(file => path.join(componentPath, file))));
      })
      .catch((e) => {
        logger.error(e);
        process.exit();
      });
  });
}

/**
 * Initializes create react component
 */
function initialize() {
  // Start timer
  /* eslint-disable no-console */
  console.time('✨  Finished in');
  const promises = [];
  // Set component name, path and full path
  const componentPath = path.join(ROOT_DIR, args[0]);
  const folderPath = path.join(ROOT_DIR, program.dir); // getComponentParentFolder(componentPath);

  if (program.createindex === true) {
    createMultiIndex(componentPath);
    return;
  }

  const isValidArgs = validateArguments(args, program);

  if (!isValidArgs) {
    return;
  }

  fs.existsSyncAsync(componentPath)
    .then(() => {
      logger.animateStart('Creating components files...');

      for (let i = 0; i < args.length; i += 1) {
        const name = getComponentName(args[i]);
        promises.push(createFiles(name, path.join(folderPath, args[i])));
      }

      return Promise.all(promises);
    })
    .then((filesArrData) => {
      logger.log(chalk.cyan('Created new React components at: '));
      // Logs component file tree
      logComponentTree(filesArrData, folderPath);
      logger.log();
      // Stop animating in console
      logger.animateStop();
      // Stop timer
      console.timeEnd('✨  Finished in');
      // Log output to console
      logger.done('Success!');
    })
    .catch((error) => {
      if (error.message === 'false') {
        logger.error(`Folder already exists at ..${componentPath}`);
        return;
      }

      logger.error(error);
    });
}

// Start script
initialize();
