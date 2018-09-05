[![Build Status](https://travis-ci.org/redhataccess/redhat_access_angular_ui.svg?branch=master)](https://travis-ci.org/redhataccess/redhat_access_angular_ui)  

### Installation

Run 'npm install' and 'bower install' to pull in dependencies.  

### Developing

Run `npm run server` to start the webpack-dev-server
Run `accessproxy` to start the proxy for Red Hat access.
In your browser visit https://qa.foo.redhat.com:1337/#/case/list

### StrataJS configuration
redhat_access_angular_ui uses [stratajs](https://github.com/redhataccess/stratajs) for communication with the Red Hat Customer Portal API and has a few options integrators should set.  These should be set prior to boostrapping the AngularJS application.

Set an identifier for auditing:  

~~~
window.strata.setRedhatClientID('product_name_and_version');  
~~~
Use a non-production Red Hat Customer Portal API:  

~~~
window.strata.setPortalHostname('hostname_with_no_protocol.com');  
~~~


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

## ITOS Setup

    rhc app create -g int_hosted_medium -a pcm -n support https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml

## Local development

    npm run server
    accessproxy
    https://qa.foo.redhat.com/
    
## Translations
To generate translation templates from the code follow the steps below.

1. Do the full build with

        npm run build
2. Generate the tanslation templates with

        npm run generate-translates
        
This should generate all required files and then scrape all keys for translations. All intermediate files should be deleted afterwards automatically.

## Release process

1. npm install -g versiony-cli
2. Run ./bump-version.sh <new-version>

