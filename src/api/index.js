const session = require('express-session');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swagger = require('swagger-ui-express');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { config } = require('../config');
const corsOptions = require('./expressConfigs/corsConfig');
const swaggerDocument = require('./swagger');
const db = require('../db/models');

const {
    RoleRouter,
    AuthRouter,
    InviteRouter,
    AnonymousRouter,
    UserRouter,
    ResourceRouter,
    TechnologyRouter,
    TypesRouter,
    LocationRouter,
    EnglishLvlRouter,
    TechLvlRouter,
    ClientRouter,
    LogsRouter,
    ProjectRouter,
    StatsRouter,
    RecipientRouter,
    MailingRouter,
    MailingRecipientRouter,
    MailingSenderRouter,
    CronRouter,
    EmailTemplateRouter,
    AuthCredentialRouter,
    GroupRouter,
    CampaignRouter,
    SignatureRouter,
    VacationRouter,
    ScriptRouter,
    HolidayRouter,
    VacationStatusRouter,
    FutureProjectRouter,
    VacationSettingsRouter,
} = require('./routers');

const { errorHandlingMiddleware, authMiddleware, loggerMiddleware,} = require('./middlewares');
const { AuthController } = require('./controllers');

function registerApi(app) {
  app.use(express.static(config.filePath.staticFiles));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));

  app.use('/', AnonymousRouter);
  app.use(
    session({
      secret: 'cddad268-e3e8-4ecc-b15b-a787a8ce894d',
      store: new SequelizeStore({
        db: db.sequelize,
      }),
      proxy: false,
      resave: true,
      saveUninitialized: true,
    }),
  );
  app.use('/', AuthRouter);
  app.use(authMiddleware);
  app.use(loggerMiddleware);

  app.post('/signOut', AuthController.signOut);
  app.use('/logs', LogsRouter);
  app.use('/user', UserRouter);
  app.use('/', InviteRouter);
  app.use('/roles', RoleRouter);
  app.use('/resource', ResourceRouter);
  app.use('/technology', TechnologyRouter);
  app.use('/types', TypesRouter);
  app.use('/location', LocationRouter);
  app.use('/engLvl', EnglishLvlRouter);
  app.use('/techLvl', TechLvlRouter);
  app.use('/client', ClientRouter);
  app.use('/recipient', RecipientRouter);
  app.use('/mailing', MailingRouter);
  app.use('/mailingRecipient', MailingRecipientRouter);
  app.use('/mailingSender', MailingSenderRouter);
  app.use('/emailTemplate', EmailTemplateRouter);
  app.use('/project', ProjectRouter);
  app.use('/stats', StatsRouter);
  app.use('/cron', CronRouter);
  app.use('/authCredential', AuthCredentialRouter);
  app.use('/group', GroupRouter);
  app.use('/campaign', CampaignRouter);
  app.use('/signature', SignatureRouter);
  app.use('/vacation', VacationRouter);
  app.use('/script', ScriptRouter);
  app.use('/holiday', HolidayRouter);
  app.use('/vacationStatus', VacationStatusRouter);
  app.use('/futureProject', FutureProjectRouter);
  app.use('/vacationSettings', VacationSettingsRouter);
  app.use(errorHandlingMiddleware);
}

module.exports = registerApi;
