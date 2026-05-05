const backendCwd = process.env.COUNTERATTACK_BACKEND_CWD || '/opt/counterattack-offer/backend';
const logDir = process.env.COUNTERATTACK_API_LOG_DIR || '/var/log/counterattack-offer/api';

module.exports = {
  apps: [
    {
      name: 'counterattack-offer-api',
      cwd: backendCwd,
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: process.env.PM2_INSTANCES || 2,
      env: {
        NODE_ENV: 'production',
      },
      out_file: `${logDir}/out.log`,
      error_file: `${logDir}/error.log`,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || '512M',
      exp_backoff_restart_delay: 1000,
      kill_timeout: 10000,
      wait_ready: false,
      listen_timeout: 10000,
      max_restarts: 10,
      min_uptime: '30s',
    },
  ],
};
