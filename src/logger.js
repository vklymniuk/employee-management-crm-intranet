const { createLogger, format, transports } = require('winston');

const myFormat = format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`);

class Logger {
  constructor() {
    this.logger = createLogger({});

    this.logger.on('error', (err) => {
      this.logError(err);
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.timestamp(), format.colorize(), myFormat),
        }),
      );
    }
  }

  logInfo(info) {
    this.logger.info(info);
  }

  logError(info) {
    this.logger.error(info);
  }

  logWarn(info) {
    this.logger.warn(info);
  }
}

module.exports = new Logger();
