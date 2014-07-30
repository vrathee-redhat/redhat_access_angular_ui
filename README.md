### Installation  
Run 'npm install' and 'bower install' to pull in dependencies.  
Execute grunt build and check the dist folder for js and css files.

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

### IE8 Support
[Angular IE8 Support Doc](https://docs.angularjs.org/guide/ie)  
The following shims and xmlns's defined:

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
