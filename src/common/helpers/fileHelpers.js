const util = require('util');
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');

const asyncFuncs = {
  readAsync: util.promisify(fs.readFile),
};

class FileHelper {
  static async exists(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, fs.F_OK, (err) => {
        if (err) {
          logger.logError(err);
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  static existsSync(filePath) {
    try {
      fs.accessSync(filePath, fs.F_OK);
      return true;
    } catch (err) {
      logger.logError(err);
      return false;
    }
  }

  static removeSync(filePath) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      logger.logError(err);
    }
  }

  static async read(filePath) {
    return asyncFuncs.readAsync(filePath);
  }

  static readSync(filePath) {
    return fs.readFileSync(filePath);
  }

  static async write(filePath, data) {
    const fPath = path.resolve(filePath);
    return new Promise((resolve, reject) => {
      fs.writeFile(fPath, data, (err) => {
        if (err) {
          logger.logError(err);
          reject(err);
        }
        resolve();
      });
    });
  }

  static async getFile(folderPath, fileName) {
    const fPath = path.resolve(folderPath);
    return new Promise((resolve, reject) => {
      fs.readdir(fPath, (err, files) => {
        if (err) {
          logger.logError(err);
          reject(err);
        }
        const file = files.find((x) => path.parse(x).name == fileName);
        resolve(file);
      });
    });
  }

  static async checkStaticFileFolders(rootRoute, staticFiles, folders) {
    const fPath = path.resolve(rootRoute, staticFiles);
    return new Promise((resolve, reject) => {
      fs.readdir(fPath, (err, files) => {
        if (err) {
          logger.logError(err);
          reject(err);
        }
        Object.keys(folders).forEach((x) => {
          if (!files.includes(folders[x])) {
            fs.mkdirSync(path.resolve(fPath, folders[x]));
          }
        });
        resolve();
      });
    });
  }
}

module.exports = FileHelper;
