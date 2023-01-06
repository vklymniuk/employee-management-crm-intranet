const excel = require('node-excel-export');

const styles = {
  header: {
    fill: {
      fgColor: {
        rgb: 'D3D3D3',
      },
    },
  },
  columnWidth: 120,
};

const resourceSpecColumns = {
  firstName: {
    displayName: 'First Name',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  lastName: {
    displayName: 'Last Name',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  resourceRole: {
    displayName: 'Role',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  techLevel: {
    displayName: 'Technical Level',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.value : ''),
  },
  englishLevel: {
    displayName: 'English Level',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.value : ''),
  },
  techLevelDescription: {
    displayName: 'Technical Level Description',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  englishLevelDescription: {
    displayName: 'English Level Description',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  location: {
    displayName: 'Location',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  primaryTechnology: {
    displayName: 'Primary Technology',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.abbreviation : ''),
  },
  secondaryTechnology: {
    displayName: 'Secondary Technology',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.abbreviation : ''),
  },
  potentialProject: {
    displayName: 'Project Potential',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  lastEvaluationDate: {
    displayName: 'Last Evaluation',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  phone: {
    displayName: 'Phone',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  email: {
    displayName: 'Email',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  remote: {
    displayName: 'Remote',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? 'Yes' : '`No'),
  },
  cvLink: {
    displayName: 'CV',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  jiraLink: {
    displayName: 'JIRA',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  hubstaffLink: {
    displayName: 'Hubstaff',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  technologies: {
    displayName: 'Technologies',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.map((item) => item.abbreviation).join(',') : ''),
  },
  projects: {
    displayName: 'Current Projects',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.map((item) => item.title).join(',') : ''),
  },
  isPartTime: {
    displayName: 'Part Time',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? 'Yes' : 'No'),
  },
  lastEnglishEvaluationDate: {
    displayName: 'English Evaluation',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  isEvaluationNeeded: {
    displayName: 'Evaluation Needed',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  assignmentType: {
    displayName: 'Assignment Type',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  githubLink: {
    displayName: 'Github',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  skype: {
    displayName: 'Skype',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  birthday: {
    displayName: 'Birthday',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  contractDate: {
    displayName: 'Contract Date',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
};

const projectSpecColumns = {
  title: {
    displayName: 'Title',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  startDate: {
    displayName: 'Start Date',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  expectedEndDate: {
    displayName: 'End Date',
    headerStyle: styles.header,
    width: styles.columnWidth,
  },
  projectStatus: {
    displayName: 'Project Status',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  clients: {
    displayName: 'Clients',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.map((item) => item.name).join(',') : ''),
  },
  flagType: {
    displayName: 'Flag',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.title : ''),
  },
  technologies: {
    displayName: 'Technologies',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.map((item) => item.abbreviation).join(',') : ''),
  },
  tierId: {
    displayName: 'Tiers',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value || '-'),
  },
  resources: {
    displayName: 'Resources',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? value.map((item) => `${item.firstName} ${item.lastName}`).join(',') : ''),
  },
  pm: {
    displayName: 'PM',
    headerStyle: styles.header,
    width: styles.columnWidth,
    cellFormat: (value) => (value ? `${value.firstName} ${value.lastName}` : ''),
  },
};

function buildResourceSpecification(columns) {
  const resourceSpecification = {};
  if (!Array.isArray(columns) || columns.length === 0) {
    return resourceSpecColumns;
  }
  columns.forEach((column) => {
    if (column === 'project') {
      resourceSpecification.projects = resourceSpecColumns.projects;
    } else if (resourceSpecColumns[column]) {
      resourceSpecification[column] = resourceSpecColumns[column];
    }
  });
  return resourceSpecification;
}

function buildProjectSpecification(columns) {
  const projectSpecification = {};
  if (!Array.isArray(columns) || columns.length === 0) {
    return projectSpecColumns;
  }

  columns.forEach((column) => {
    if (projectSpecColumns[column]) {
      projectSpecification[column] = projectSpecColumns[column];
    }
  });

  return projectSpecification;
}

class ExcelHelper {
  static buildResourceExcel(data, columns) {
    return excel.buildExport([
      {
        name: 'Resources',
        specification: buildResourceSpecification(columns),
        data,
      },
    ]);
  }

  static buildProjectExcel(data, columns) {
    return excel.buildExport([
      {
        name: 'Projects',
        specification: buildProjectSpecification(columns),
        data,
      },
    ]);
  }
}

module.exports = ExcelHelper;
