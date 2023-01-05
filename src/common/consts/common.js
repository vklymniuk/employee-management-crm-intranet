const COMMON = {
    ORDER: {
      ASC: 'ASC',
      DESC: 'DESC',
    },
    SQL: {
      FUNC: {
        ISNULL: 'ISNULL',
        GROUP_CONCAT: 'GROUP_CONCAT',
        COUNT: 'COUNT',
        MONTH: 'MONTH',
        LOWER: 'LOWER',
      },
    },
    MONTH_NAMES: [
      'January', 
      'February', 
      'March', 
      'April', 
      'May', 
      'June',
      'July', 
      'August', 
      'September', 
      'October', 
      'November', 
      'December',
    ],
    VACATION_APPROVAL_ROLES: ['PM', 'QAL', 'PML', 'HR', 'ADMIN', 'EXECUTIVE'],
    VACATION_RECALCULATE_METHOD: {
      CREATE: 'CREATE',
      UPDATE: 'UPDATE',
      DELETE: 'DELETE',
      REJECT: 'REJECT',
    },
    DATE_BEFORE_TYPE: {
      MONTH: 'month',
      WEEK: 'week',
    },
    CONTRACT_EXPIRATION_TYPE: {
      MONTH: 'month',
      WEEK: 'week',
    },
    VACATION_EMAIL_TYPE: {
      CREATED: 'created',
      APPROVED: 'approved',
    },
};

module.exports = COMMON;
  