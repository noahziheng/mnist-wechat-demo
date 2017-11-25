module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'mnist-wechat-demo',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root',
      host: '121.42.231.226',
      ref: 'origin/master',
      repo: 'git@github.com:noahziheng/mnist-wechat-demo.git',
      path: '/data/www/mnist-wechat-demo',
      'post-deploy': 'yarn install && pm2 reload ecosystem.config.js --env production'
    },
    dev: {
      user: 'root',
      host: '121.42.231.226',
      ref: 'origin/master',
      repo: 'git@github.com:noahziheng/mnist-wechat-demo.git',
      path: '/data/www/mnist-wechat-demo',
      'post-deploy': 'yarn install && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev'
      }
    }
  }
}
