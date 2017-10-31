'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/fullcalendar/dist/fullcalendar.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/es5-shim/es5-shim.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/moment/moment.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
