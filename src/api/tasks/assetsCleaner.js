const fs = require('fs');
const { config } = require('../../config');
const ServicesFactory = require('../../services');

async function emailsAssetsCleaner() {
  const emailTemplateService = ServicesFactory.createEmailTemplateService();
  const result = await emailTemplateService.getEmailTemplates();
  const { emailTemplates } = result;
  let imageIds = [];
  const assetsDir = `${config.filePath.staticFiles}/${config.filePath.folders.assets}`;
  emailTemplates.forEach((templateItem) => {
    if (templateItem.imageIds) {
      const ids = JSON.parse(templateItem.imageIds);
      imageIds = imageIds.concat(ids);
    }
  });
  await fs.readdir(assetsDir, { withFileTypes: true }, (err, files) => {
    const uploadedAssets = files.filter((file) => file.isFile()).map((file) => file.name);
    const filesForDelete = uploadedAssets.filter((asset) => !imageIds.includes(asset));
    filesForDelete.forEach((filename) => {
      fs.unlink(`${assetsDir}/${filename}`, () => {});
    });
  });
}

module.exports = emailsAssetsCleaner;