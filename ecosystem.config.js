module.exports = {
  apps : [{
    name: 'cineSwipe',
    script: 'app.js',
    instances: 'max',
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
