[![Build Status](https://travis-ci.org/redhataccess/redhat_access_angular_ui.svg?branch=master)](https://travis-ci.org/redhataccess/redhat_access_angular_ui)  

### Installation  
Run 'npm install' and 'bower install' to pull in dependencies.  
Execute grunt build and check the dist folder for js and css files.

### StrataJS configuration
redhat_access_angular_ui uses [stratajs](https://github.com/redhataccess/stratajs) for communication with the Red Hat Customer Portal API and has a few options integrators should set.  
Set an identifier for auditing:  
window.strata.setRedhatClientID('product_name_and_version');  
Use a non-production Red Hat Customer Portal API:  
window.strata.setPortalHostname('hostname_with_no_protocol.com');  


### Bootstrapping a module inside of another angular app
#### HTML
~~~
<body>
  <div id="main" class="content-area">
    <div ng-non-bindable data-$injector="">
      <div id='redhat-access-cases'>
        <div ui-view autoscroll="false"></div>
      </div>
    </div>
  </div>
</body>
~~~  

#### JavaScript
~~~
angular.module('RedhatAccess.cases').config(function ($urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('case/list');
});

angular.element(document).ready(function() {
  angular.bootstrap(document.getElementById("redhat-access-cases"), ['RedhatAccess.cases']);
});
~~~

### Module configuration
The RedhatAccess.cases module has the following configuration options(They MUST ALL be specified if deviating from the default)  :  

~~~
angular.module('RedhatAccess.cases')
.value('NEW_CASE_CONFIG', {
  'showRecommendations': true,
  'showAttachments': true,
  'showServerSideAttachments': true
})
.value('EDIT_CASE_CONFIG', {
  'showDetails': true,
  'showDescription': true,
  'showBugzillas': true,
  'showAttachments': true,
  'showRecommendations': true,
  'showComments': true,
  'showServerSideAttachments': true,
  'showEmailNotifications': true
});
~~~

### IE8 Support
[Angular IE8 Support Doc](https://docs.angularjs.org/guide/ie)  
Included in bower_components but not in the dist/redhat_access_angular_ui.js combined module.  
The following shims and xmlns's should be defined:  

~~~
<html xmlns:ng="http://angularjs.org" xmlns:rha="http://access.redhat.com">
<head>
<!--[if lte IE 8]>
<script type="text/javascript" src="js/json2.js"></script>
<script type="text/javascript" src="js/ie-shiv.js"></script>                                                                                                                                          
<script type="text/javascript" src="js/es5-shim.js"></script>
<script type="text/javascript" src="js/html5shiv.js"></script>
<script type="text/javascript" src="js/respond.min.js"></script>
<![endif]-->
</head>
~~~
