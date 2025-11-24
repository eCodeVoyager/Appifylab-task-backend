const fs = require('fs');
const path = require('path');

const createDirectory = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const templates = {
  controller: moduleName => `const catchAsync = require('../../../utils/catchAsync');
const ApiResponse = require('../../../utils/apiResponse');
const ${moduleName}Service = require('../services/${moduleName}Service');

const get${moduleName}s = catchAsync(async (req, res) => {
  const ${moduleName.toLowerCase()}s = await ${moduleName}Service.get${moduleName}s();
  res.json(new ApiResponse(200, ${moduleName.toLowerCase()}s, '${moduleName}s retrieved successfully'));
});

module.exports = {
  get${moduleName}s,
};
`,
  model: moduleName => `const mongoose = require('mongoose');

const ${moduleName.toLowerCase()}Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('${moduleName}', ${moduleName.toLowerCase()}Schema);
`,
  routes: moduleName => `const express = require('express');
const ${moduleName.toLowerCase()}Controller = require('../controllers/${moduleName}Controller');
const authenticate = require('../../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, ${moduleName.toLowerCase()}Controller.get${moduleName}s);

module.exports = router;
`,
  service: moduleName => `const ${moduleName}Model = require('../models/${moduleName}Model');

const get${moduleName}s = async () => {
  return await ${moduleName}Model.find();
};

module.exports = {
  get${moduleName}s,
};
`,
  validation: moduleName => `const Joi = require('joi');

const create${moduleName} = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

module.exports = {
  create${moduleName},
};
`,
  index:
    moduleName => `const ${moduleName}Controller = require('./controllers/${moduleName}Controller');
const ${moduleName}Model = require('./models/${moduleName}Model');
const ${moduleName}Routes = require('./routes/${moduleName}Routes');
const ${moduleName}Service = require('./services/${moduleName}Service');
const ${moduleName}Validation = require('./validations/${moduleName}Validation');

module.exports = {
  ${moduleName}Controller,
  ${moduleName}Model,
  ${moduleName}Routes,
  ${moduleName}Service,
  ${moduleName}Validation,
};
`,
};

const moduleCreator = moduleName => {
  const modulePath = path.join(__dirname, '../..', 'src', 'modules', moduleName);
  console.log('Resolved module path:', modulePath);

  const directories = ['controllers', 'models', 'routes', 'services', 'validations'];

  createDirectory(modulePath);
  directories.forEach(dir => createDirectory(path.join(modulePath, dir)));

  fs.writeFileSync(path.join(modulePath, 'index.js'), templates.index(moduleName));

  const files = {
    controllers: { name: `${moduleName}Controller.js`, template: templates.controller },
    models: { name: `${moduleName}Model.js`, template: templates.model },
    routes: { name: `${moduleName}Routes.js`, template: templates.routes },
    services: { name: `${moduleName}Service.js`, template: templates.service },
    validations: { name: `${moduleName}Validation.js`, template: templates.validation },
  };

  Object.entries(files).forEach(([folder, { name, template }]) => {
    fs.writeFileSync(path.join(modulePath, folder, name), template(moduleName));
  });

  console.log(`Module '${moduleName}' created successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Add route to src/app.js:`);
  console.log(
    `   app.use('/api/v1/${moduleName.toLowerCase()}', require('./modules/${moduleName}/routes/${moduleName}Routes'));`
  );
  console.log(`2. Update your module files as needed`);
};

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  console.error('Usage: npm run module <moduleName>');
  process.exit(1);
}

moduleCreator(moduleName);
