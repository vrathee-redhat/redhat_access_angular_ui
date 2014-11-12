/*global document, window, angular*/
(function() {
  window.chrometwo_require([
    'angular128',
    'jquery'
  ], function(angular, jq) {
    'use strict';
    window.require.config({
      paths: {
        'strata': '/bower_components/stratajs/strata'
      },
      map: {
        '*': {
          'angular': 'angular128'
        }
      }
    });

    window.chrometwo_require(['strata'], function(strata) {
      // export strata
      window.strata = strata;
    });

    // keep track of deferreds we are loading
    var dfds = [];
    var qLoad = function(mod, index) {
      var previousDfd = dfds[index - 1];
      dfds[index] = new jq.Deferred();
      // Internal load that actually wraps the chrometwo_require
      var _load = function() {
        window.chrometwo_require(mod.split(), function() {
          // All good, resolve deferred
          dfds[index].resolve();
        });
      };
      if (previousDfd) {
        // We have a previous mod loading, chain the next load
        previousDfd.always(_load);
      } else {
        // First module being loaded. Fire away
        _load();
      }
      return dfds[index].promise();
    };
    // Queue up loading of modules
    for (var i = 0; i < window.deps.length; i++) {
      qLoad(window.deps[i], i);
    }
    // Once all modules have loaded bootstrap it
    jq.when.apply(jq, dfds).always(function() {
      // Bootstrap angular app
      angular.bootstrap(document, ['RedhatAccess']);
      // Fade in main element
      jq('#pcm').fadeIn();
    });

  });
})();
