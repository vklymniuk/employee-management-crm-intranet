const path = require('path');
const FileHelpers = require('./fileHelpers');
const { config, env } = require('../../config');

class PathHelpers {
  static async getAvatarPath(name, folder) {
    const { staticFiles } = config.filePath;
    const folderPath = path.resolve(env.ROOT_PATH, staticFiles, folder);
    const file = await FileHelpers.getFile(folderPath, name);

    if (file) {
      return path.join(folder, file);
    }

    return null;
  }
}

module.exports = PathHelpers;