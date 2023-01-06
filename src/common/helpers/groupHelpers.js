class GroupHelpers {
    static groupResourcesByAssignmentType(resources) {
      if (!Array.isArray(resources)) {
        return null;
      }
      const groups = resources.reduce((result, current) => {
        let title;
        if (current.currentAssignmentType && current.currentAssignmentType.title) {
          title = current.currentAssignmentType.title.toLowerCase();
        } else {
          title = 'uncategorized';
        }
        const prev = result[title] || [];
        result[title] = [...prev, current];
        return result;
      }, {});
      Object.keys(groups)
        .forEach((key) => groups[key]
          .sort((a, b) => {
            if (a.resourceRole === null || a.resourceRole.orderForBoards === null) {
              return 1;
            }
            if (b.resourceRole === null || b.resourceRole.orderForBoards === null) {
              return -1;
            }
            return a.resourceRole.orderForBoards - b.resourceRole.orderForBoards;
          }));
      return groups;
    }
  
    static groupLogsByDate(logs) {
      if (!Array.isArray(logs)) return null;
  
      return logs.reduce((result, current) => {
        const uniqueId = Date.parse(current.createdAt);
  
        if (!current && !current.user) return null;
  
        if (current && current.user) {
          if (!result[uniqueId]) {
            result[uniqueId] = {
              id: current.id,
              identifier: uniqueId,
              actionType: current.actionType,
              entityType: current.entityType,
              entityId: current.entityId,
              user: {
                id: current.user.id,
                email: current.user.email,
                firstName: current.user.firstName,
                lastName: current.user.lastName,
                roleId: current.user.roleId,
              },
              createdAt: current.createdAt,
              changes: [],
            };
          }
  
          if (current.actionType === 'updated') {
            result[uniqueId].changes.push({
              fieldName: current.fieldName,
              oldData: current.oldData,
              newData: current.newData,
              whereCollection: current.whereCollection,
              collectionId: current.collectionId,
            });
          }
        }
  
        return result;
      }, {});
    }
  }
  
  module.exports = GroupHelpers;
  