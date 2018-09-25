const path = require('path');
const chalk = require('chalk');
const logger = require('../logger');
const fs = require('./fileHelpers');
const { createIndexForFolders } = require('../data/componentData');

/**
 * Removes none directorys from array
 *
 * @param {String} folderPath - Folder path string
 * @param {Array} folders - Array of folder names
 * @returns {Promise<Array>} folders -  Directory only filtered array
 */
function removeNoneDir(folderPath, folders) {
  return new Promise((resolve, reject) => {
    const promises = [];

    for (let i = 0; i < folders.length; i += 1) {
      const folder = folders[i];
      const tempPath = path.join(folderPath, folder);
      promises.push(fs.isDirectory(tempPath));
    }

    Promise.all(promises)
      .then(values => resolve(folders.filter((folder, i) => values[i])))
      .catch(err => reject(err));
  });
}

/**
 * Matches only alphabetic character
 *
 * @param {String} str
 * @param {Boolean}
 */
function isLetter(str) {
  return str.length === 1 && str.match(/[A-z]/i);
}

/**
 * Creates index.js for multiple components imports.
 * import example when index.js has been created in root of
 * /components folder
 * - import { Component1, Component2 } from './components'
 *
 * @param {String} folderPath  - Path to folder path
 */
function createMultiIndex(folderPath) {
  fs
    .readDirAsync(folderPath)
    .then(folders => removeNoneDir(folderPath, folders)) // Filter out none folders
    .then((folders) => {
      // Filter out items with none alphabetical first character
      const filteredFolders = folders.filter(folder => isLetter(folder.charAt(0)));
      // Create data for index file
      const data = createIndexForFolders(filteredFolders);
      const indexFilePath = path.join(folderPath, 'index.js');

      fs
        .writeFileAsync(indexFilePath, data)
        .then(() => {
          logger.log();
          logger.animateStop();
          logger.log(`${chalk.cyan('Created index.js file at:')}`);
          logger.log(indexFilePath);
          logger.log();
          console.timeEnd('✨  Finished in'); /* eslint-disable-line no-console */
          logger.done('Success!');
        })
        .catch(e => logger.error(e));
    })
    .catch((e) => {
      if (e.code === 'ENOENT') {
        logger.error(`No such file or directory ${e.path}`);
        return;
      }

      if (e instanceof TypeError) {
        logger.error('You must provide a components folder string');
        return;
      }

      logger.error(e);
    });
}

module.exports = createMultiIndex;
