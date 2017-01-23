module.exports = function(config) {
  config.set({
    files: [
"https://cdnjs.cloudflare.com/ajax/libs/chrono-node/1.2.5/chrono.min.js",
"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js",
      'https://code.jquery.com/jquery-3.1.1.min.js',
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js',
      './public/app.js',
      './test.js',
      { pattern: './public/templates/*.html', included: false, served: true }
    ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    port: 9876,
    proxies: {
      '/templates/': 'http://localhost:9876/base/public/templates/',
      '/': 'http://localhost:9876/base/public/'
    }
  });
};
