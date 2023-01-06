class SortHelpers {
    static sortProjectResources(response) {

      if (Array.isArray(response.projects)) {

        const { projects } = response;
        projects.forEach((project) => {

          if (project.resources) {

            project.resources.sort((a, b) => {

                if (a.resourceRole == null) {
                    return 1;
                }

                if (b.resourceRole == null) {
                    return -1;
                }

                return a.resourceRole.orderForBoards - b.resourceRole.orderForBoards;
            });
          }
        });
      }
    }
}

module.exports = SortHelpers;