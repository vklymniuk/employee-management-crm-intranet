const { env } = require('./src/config');

const dev = {
  apps: [
    {
      name: 'api',
      script: 'app.js',
      node_args: '--inspect=0.0.0.0',
      autorestart: true,
      watch: true,
      ignore_watch: ['.git', '.idea', 'node_modules', '.vscode', 'src/tokens', 'uploads', 'log'],
      watch_options: {
        usePolling: true,
      },
    },
  ],
};

const prod = {
  apps: [
    {
      name: 'api',
      script: 'app.js',
      autorestart: true,
    },
  ],
};

module.exports = env.NODE_ENV === 'production' ? prod : dev;
