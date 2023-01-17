const { Joi } = require('express-validation');
const {
  email,
  link,
  phone,
  id,
  nullableDate,
  nullableString,
  date,
  string,
  boolean,
  number,
} = require('./rules');

const create = {
  body: Joi.object({
    phone: phone.allow(null).allow(''),
    hubstaffLink: link.allow(null).allow(''),
    cvLink: link.allow(null).allow(''),
    jiraLink: link.allow(null).allow(''),
    githubLink: link.allow(null).allow(''),
    email,
    firstName: Joi.string(),
    lastName: Joi.string(),
    lastEnglishEvaluationDate: nullableDate.allow(''),
    contractDate: nullableDate.allow(''),
    isPartTime: Joi.boolean().default(false),
    remote: Joi.boolean().default(false),
    skype: nullableString.allow(''),
    lastEvaluationDate: nullableDate.allow(''),
    isEvaluationNeeded: Joi.boolean().default(false),
    englishLevelDescription: nullableString.allow(''),
    techLevelDescription: nullableString.allow(''),
    birthday: nullableDate.allow(''),
    primaryTechnologyId: id.allow(null).allow(''),
    secondaryTechnologyId: id.allow(null).allow(''),
    techLevelId: id.allow(null).allow(''),
    resourceRoleId: id.allow(null).allow(''),
    potentialProjectId: id.allow(null).allow(''),
    defaultAssignmentTypeId: id.allow(null).allow(''),
    englishLevelId: id.allow(null).allow(''),
    locationId: id.allow(null).allow(''),
    contractStartDate: nullableDate.allow(''),
    contractEndDate: nullableDate.allow(''),
    paidVacationDays: id.allow(null).allow(''),
    unpaidVacationDays: id.allow(null).allow(''),
    statusFilter: string,
    hireDate: nullableDate.allow(''),
    terminationDate: nullableDate.allow(''),
    eligibleForRehire: Joi.boolean(),
  }).unknown(),
};

const update = {
  body: create.body,
  params: Joi.object({
    id: id.required(),
  }),
};

const changeTechnology = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    technologyId: id.required(),
  }),
};

const updateTechnologiesList = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    technologies: Joi.array(),
  }),
};

const changeProject = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    assignmentTypeId: id.optional(),
    projectId: id.required(),
  }),
};

const updateProject = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    projectId: id.required(),
    order: Joi.number().optional(),
    assignmentTypeId: id.optional(),
  }),
};

const updateProjects = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    resourceObj: Joi.object().required(),
  }),
};

const updateAssignmentType = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    assignmentTypeId: id.required(),
    order: Joi.number().optional(),
  }),
};

const createContract = {
  body: Joi.object({
    startDate: date.required(),
    endDate: date.required(),
    text: string.optional(),
  }),
};

const updateContract = {
  params: Joi.object({
    id: id.required(),
    contractId: id.required(),
  }),
  body: Joi.object({
    startDate: date.optional(),
    endDate: date.optional(),
    text: string.optional(),
  }),
};

const removeContract = {
  params: Joi.object({
    id: id.required(),
    contractId: id.required(),
  }),
};

const updateHireBlock = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    hireDate: Joi.string()
      .allow('')
      .optional(),
    statusFilter: string.optional(),
    terminationDate: Joi.string()
      .allow('')
      .optional(),
    eligibleForRehire: Joi.boolean().optional(),
  }),
};

const updateContactBlock = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    email: email.optional().allow(''),
    phone: phone.allow(null).allow(''),
    skype: nullableString.allow(''),
    jiraLink: link.allow(null).allow(''),
    githubLink: link.allow(null).allow(''),
  }),
};

const updateVacationInfo = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    contractStartDate: nullableDate.allow(''),
    contractEndDate: nullableDate.allow(''),
    paidVacationDays: number.optional(),
    unpaidVacationDays: number.optional(),
  }),
};

const updateOtherInfo = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    birthday: nullableDate.optional().allow(''),
    remote: boolean.optional(),
    isPartTime: boolean.optional(),
    cvLink: string.optional().allow(''),
    hubstaffLink: string.optional().allow(''),
    lastEvaluationDate: nullableDate.optional().allow(''),
    isEvaluationNeeded: boolean.optional(),
    defaultAssignmentTypeId: id.allow(null).allow(''),
    assignmentTypeId: id.optional(),
  }),
};

const updateMainInfo = {
  params: Joi.object({
    id: id.required(),
  }),
  body: Joi.object({
    firstName: string.optional(),
    lastName: string.optional(),
    resourceRoleId: id.allow(null).allow(''),
    primaryTechnologyId: id.allow(null).allow(''),
    secondaryTechnologyId: id.allow(null).allow(''),
    techLevelId: id.allow(null).allow(''),
    englishLevelId: id.allow(null).allow(''),
    englishLevelDescription: nullableString.allow(''),
    techLevelDescription: nullableString.allow(''),
    locationId: id.allow(null).allow(''),
  }),
};

/* Salary Schemas */
const createSalary = {
  body: Joi.object({
    startDate: date.required(),
    endDate: date.required(),
    amount: number.required(),
  }),
};

const updateSalary = {
  params: Joi.object({
    id: id.required(),
    salaryId: id.required(),
  }),
  body: createSalary.body,
};

const removeSalary = {
  params: Joi.object({
    id: id.required(),
    salaryId: id.required(),
  }),
};

/* Signing Bonus Schemas */
const createSigningBonus = {
  body: Joi.object({
    status: Joi.string()
      .valid('paid', 'unpaid')
      .required(),
    date: date.required(),
    amount: number.required(),
  }),
};

const updateSigningBonus = {
  params: Joi.object({
    id: id.required(),
    signingId: id.required(),
  }),
  body: createSigningBonus.body,
};

const removeSigningBonus = {
  params: Joi.object({
    id: id.required(),
    signingId: id.required(),
  }),
};


/* Referral Bonus Schemas */
const createReferralBonus = {
  body: Joi.object({
    status: Joi.string()
      .valid('paid', 'unpaid')
      .required(),
    date: date.required(),
    amount: number.required(),
    invitedResourceId: id.required(),
    typeOfPayment: string.optional(),
  }),
};

const updateReferralBonus = {
  params: Joi.object({
    id: id.required(),
    referralId: id.required(),
  }),
  body: createReferralBonus.body,
};

const removeReferralBonus = {
  params: Joi.object({
    id: id.required(),
    referralId: id.required(),
  }),
};

/* Comment Schemas */
const createComment = {
  body: Joi.object({
    commentOwnerId: id.required(),
    text: string.optional(),
  }),
};

const updateComment = {
  params: Joi.object({
    id: id.required(),
    commentId: id.required(),
  }),
  body: createComment.body,
};

const removeComment = {
  params: Joi.object({
    id: id.required(),
    commentId: id.required(),
  }),
};

module.exports = {
  create,
  update,
  updateProject,
  changeProject,
  changeTechnology,
  updateAssignmentType,
  updateTechnologiesList,
  updateProjects,
  createContract,
  updateContract,
  removeContract,
  updateHireBlock,
  updateContactBlock,
  updateVacationInfo,
  updateOtherInfo,
  updateMainInfo,
  createSalary,
  updateSalary,
  removeSalary,
  createSigningBonus,
  updateSigningBonus,
  removeSigningBonus,
  createReferralBonus,
  updateReferralBonus,
  removeReferralBonus,
  createComment,
  updateComment,
  removeComment,
};