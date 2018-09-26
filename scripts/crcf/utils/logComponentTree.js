const logger = require('../logger');
const path = require('path');

/**
 * Creates and logs component file tree
 *
 * @param {Array} filesArrData - Array of file names
 * @param {String} folderPath - Folder path of files
 */
function logComponentTree(filesArrData, folderPath) {
  for (let i = 0; i < filesArrData.length; i += 1) {
    const name = filesArrData[i][1];
    const filesArr = filesArrData[i];
    const folderPath = path.dirname(name);
    logger.log(path.relative(process.cwd(), folderPath));

    // Log files
    for (let j = 0; j < filesArr.length; j += 1) {
      const fileName = path.relative(folderPath, filesArr[j]);
      logger.log(`  └─ ${fileName}`);
    }
  }
}

module.exports = logComponentTree;
