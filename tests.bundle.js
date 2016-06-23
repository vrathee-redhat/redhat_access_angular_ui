'use strict';

require('./app/main.module');
require('./test/mocks/mockStrataService');
require('./test/mocks/mockUDSService');

let testsContext = require.context('./test/spec', true, /.test.js/);
// let testsContext = require.context('./test/spec', true, /security.directives.test.js/);
testsContext.keys().forEach(testsContext);
