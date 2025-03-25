module.exports = {
  apps: [{
    name: 'expense-manager-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001,
      MONGODB_URI: 'your_mongodb_uri',
      JWT_SECRET: 'your_jwt_secret'
    }
  }]
}; 