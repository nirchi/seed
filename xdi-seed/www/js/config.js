'use strict';

// Declare app level module which depends on filters, and services
angular.module('xdiApp.config', [])

    // version of this seed app
    .constant('version', '0.1')

    // your Firebase URL goes here
    .constant('FBURL', 'https://xdi.firebaseio.com');

//you can use this one to try out a demo of the seed
//.constant('FBURL', 'https://angularfire-seed.firebaseio.com');


/*********************
 * !!FOR E2E TESTING!!
 *
 * Must enable email/password logins and manually create
 * the test user before the e2e tests will pass
 *
 * user: test@test.com
 * pass: test123
 */
