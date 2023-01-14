const multer = require('multer');
const path = require('path');
const { config } = require('../../config');
const { FileHelpers } = require('../../common/helpers');

// eslint-disable-next-line consistent-return
function identifier(req, key) {
  // eslint-disable-next-line default-case
  switch (key) {
    case 'user':
      return req.user.userId;
    case 'resource':
      return req.params.id;
    case 'project':
      return req.params.id;
    case 'import':
      return 'recipients';
    case 'asset':
      return req.params.id;
  }
}

// eslint-disable-next-line consistent-return
function staticPath(key) {
  // eslint-disable-next-line default-case
  switch (key) {
    case 'user':
      return config.filePath.folders.userAvatar;
    case 'resource':
      return config.filePath.folders.resourceAvatar;
    case 'project':
      return config.filePath.folders.projects;
    case 'import':
      return config.filePath.folders.import;
    case 'asset':
      return config.filePath.folders.assets;
  }
}

function uploader(key) {
  const items = path.join(config.filePath.staticFiles, staticPath(key));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, items);
    },

    filename: (req, file, cb) => {
      const name = identifier(req, key).toString();\

      if (FileHelpers.existsSync(path.join(items, `${name}.png`))) {
        FileHelpers.removeSync(path.join(items, `${name}.png`));
      }
      
      if (FileHelpers.existsSync(path.join(items, `${name}.jpg`))) {
        FileHelpers.removeSync(path.join(items, `${name}.jpg`));
      }

      if (FileHelpers.existsSync(path.join(items, `${name}.jpeg`))) {
        FileHelpers.removeSync(path.join(items, `${name}.jpeg`));
      }

      if (FileHelpers.existsSync(path.join(items, `${name}.gif`))) {
        FileHelpers.removeSync(path.join(items, `${name}.gif`));
      }

      if (FileHelpers.existsSync(path.join(items, `${name}.xlsx`))) {
        FileHelpers.removeSync(path.join(items, `${name}.xlsx`));
      }

      cb(null, name + path.extname(file.originalname).toLowerCase());
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (ext.indexOf('jpg') !== -1
      || ext.indexOf('jpeg') !== -1
      || ext.indexOf('png') !== -1
      || ext.indexOf('gif') !== -1
      || file.mimetype.indexOf('spreadsheetml') !== -1
      || file.mimetype.indexOf('application') !== -1) {
      cb(null, true);
    } else {
      cb(new Error('File format should be PNG,JPG,JPEG'), false);
    }
  };

  const upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    dest: items,
    storage,
    fileFilter,
  });

  return upload;
}

function UserUpload() {
  return uploader('user');
}

function ResourceUpload() {
  return uploader('resource');
}

function ProjectUpload() {
  return uploader('project');
}

function ExcelImportUpload() {
  return uploader('import');
}

function EmailAssetsUpload() {
  return uploader('asset');
}

module.exports = { UserUpload, ResourceUpload, ProjectUpload, ExcelImportUpload, EmailAssetsUpload, };