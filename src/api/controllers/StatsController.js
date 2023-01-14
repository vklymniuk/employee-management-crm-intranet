const ServicesFactory = require('../../services');

async function getResourceStats(req, res, next) {
  try {
    
    const statsService = ServicesFactory.createStatsService();
    const result = await statsService.getResourcesData();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getProjectStats(req, res, next) {
  try {

    const { userId } = req.user;
    const statsService = ServicesFactory.createStatsService(userId);
    const result = await statsService.getProjectsData();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getProjectFlags(req, res, next) {
  try {

    const { userId } = req.user;
    const statsService = ServicesFactory.createStatsService(userId);
    const result = await statsService.getFlagsData();
    res.send(result);

  } catch (err) {
    next(err);
  }
}

async function getClosedProjectsStats(req, res, next) {
  try {

    const projectService = ServicesFactory.createProjectService();
    const allProjects = await projectService.getAllProjectsByYear();
    const closedProjects = await projectService.getClosedProjectsByYear();

    const result = allProjects.map((obj) => {
      const item = obj.toJSON();
      const allProjectsCount = item.projects;
      const closedProject = closedProjects.find((_p) => {
        const p = _p.toJSON();
        return p.year === item.year;
      });
      const closedProjectsCounts = closedProject?.toJSON()?.projects || 0;

      const value = (closedProjectsCounts / allProjectsCount) * 100;


      return {
        year: item.year,
        value: `${Math.round(value * 10) / 10}%`,
        closedProjectsCount: closedProjectsCounts,
        allProjectsCount,
      };
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getResourceStats, getProjectStats, getProjectFlags, getClosedProjectsStats, };