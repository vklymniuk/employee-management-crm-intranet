const db = require('../models');
const { DateHelpers, TokenHelpers } = require('../../common/helpers');

class ModelsFactory {
  constructor(models) {
    this.models = models;
    this.tokenLength = 32;
  }

  createRole(role) {
    return this.models.Role.build(role);
  }

  createUser(user) {
    return this.models.User.build(user);
  }

  createResourceRole(resourceRole) {
    return this.models.ResourceRole.build(resourceRole);
  }

  createActionLog(actionLog) {
    return this.models.ActionLog.build(actionLog);
  }

  async createInvite(invite) {
    const { sendedByUserId, roleId, invitationEmail } = invite;
    const token = await TokenHelpers.generateRandomToken(this.tokenLength);
    const inviteEntity = {
      sendedByUserId,
      invitationEmail,
      roleId,
      sendedAt: DateHelpers.getCurrentUtc().toDate(),
      isCompleted: false,
      verificationToken: token,
    };
    const result = await this.models.Invite.build(inviteEntity);
    return result;
  }

  createResource(resource) {
    return this.models.Resource.build(resource);
  }

  createTechnology(technology) {
    return this.models.Technology.build(technology);
  }

  createTechLvl(techLvl) {
    return this.models.TechLevel.build(techLvl);
  }

  createEnglishLvl(englishLvl) {
    return this.models.EnglishLevel.build(englishLvl);
  }

  createClient(client) {
    return this.models.Client.build(client);
  }

  createProject(project) {
    return this.models.Project.build(project);
  }

  createEmpProject(empProj) {
    return this.models.ResourceProject.build(empProj);
  }

  createEmpAssign(empAssign) {
    return this.models.EmpActualAssignType.build(empAssign);
  }
}

module.exports = new ModelsFactory(db);
