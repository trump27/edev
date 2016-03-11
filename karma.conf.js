var webpackConf = require('./webpack.config.js')
delete webpackConf.entry
webpackConf.devtool = 'inline-source-map'

module.exports = function(config) {
  config.set({
    basePath: '',
    webpack: webpackConf,
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    files: ['test/index.js'],
    exclude: [],
    preprocessors: {'test/index.js': ['webpack', 'sourcemap']},
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    // logLevel: config.LOG_DEBUG,
    autoWatch: true,
    // browsers: [Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
