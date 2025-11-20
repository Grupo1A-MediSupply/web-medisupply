// Karma configuration for CI/CD pipelines
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Disable random execution order for consistent results
        random: false
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/medical-distribution-prototype'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' } // For CI/CD integration
      ],
      check: {
        global: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0
        }
      }
    },
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--remote-debugging-port=9222',
          '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: true, // Important for CI/CD
    restartOnFileChange: false,
    failOnEmptyTestSuite: false,
    logLevel: config.LOG_INFO
  });
};
