const { Joi } = require('express-validation');
const {
  nullableDate, nullableString, id, string, boolean,
} = require('./rules');

const create = {
  body: Joi.object({
    id: id.optional(),
    title: Joi.string().required(),
    startDate: nullableDate.allow(''),
    expectedEndDate: nullableDate.allow(''),
    actualEndDate: nullableDate.allow(''),
    links: nullableString.allow(''),
    contacts: nullableString.allow(''),
    flagText: nullableString.allow(''),
    pmWorkloadId: Joi.number().allow('').allow(null).min(0)
      .max(3)
      .optional(),
    description: nullableString.allow(''),
    flagTypeId: id.allow(null).allow(''),
    projectStatusId: id.allow(null).allow(''),
    projectType: nullableString.allow(''),
    statusUpdateDate: nullableDate.allow(''),
    flagUpdateDate: nullableDate.allow(''),
    deletedAt: nullableDate.allow(''),
    resources: nullableString.allow(''),
    projectStatus: nullableString.allow(''),
    flagType: nullableString.allow(''),
    tier: nullableString.allow(''),
    tierId: id.allow(null).allow(''),
    statusText: nullableString.allow(''),
    technologies: nullableString.allow(''),
    avatarUrl: nullableString.allow(''),
    projectNote: nullableString.allow(''),
    issueSide: nullableString.valid('our', 'client', 'done').allow(''),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

const addResource = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    resourceId: id.required(),
    assignmentTypeId: id.optional(),
  }),
};

const removeResource = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    resourceId: id.required(),
  }),
};

const updateResource = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    resourceId: id.required(),
    assignmentTypeId: id.required(),
  }),
};

const addTechnology = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    technologyId: id.required(),
    resourceId: id.optional(),
  }),
};

const updateTechnology = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    projTechId: id.required(),
    resourceId: id.optional(),
  }),
};

const removeTechnology = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    projTechId: id.required(),
  }),
};

const moveResource = {
  body: Joi.object({
    fromProjectId: id.required(),
    toProjectId: id.required(),
    assignmentTypeId: id.required(),
    resourceId: id.required(),
  }),
};

const startProject = {
  params: Joi.object({
    id: id.required(),
  }),
};

const updateWorkload = {
  body: Joi.object({
    workloadId: id.required(),
  }),
};

const addVacancy = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    title: string.required(),
    approved: boolean.strict().required(),
    resourceId: id.optional(),
    technologyId: id.optional(),
    technologyTypeId: id.optional(),
  }),
};

const updateVacancy = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    vacancyId: id.required(),
    title: string.required(),
    approved: boolean.strict().required(),
    resourceId: id.strict().allow(null),
    technologyId: id.optional(),
    technologyTypeId: id.optional(),
  }),
};

const removeVacancy = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    vacancyId: id.required(),
  }),
};

module.exports = {
  create,
  update,
  addResource,
  removeResource,
  updateResource,
  addTechnology,
  updateTechnology,
  removeTechnology,
  moveResource,
  startProject,
  updateWorkload,
  addVacancy,
  updateVacancy,
  removeVacancy,
};