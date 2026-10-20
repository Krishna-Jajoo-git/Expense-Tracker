module.exports = {
  apps: [
    {
      name: 'expense-tracker-server',
      script: './server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      max_memory_restart: '500M',
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      autorestart: true,
      restart_delay: 4000
    }
  ]
};
