angular.module('RedhatAccess', [
	'ngSanitize',
	'RedhatAccess.header',
	'RedhatAccess.template',
	'RedhatAccess.cases',
	'RedhatAccess.security',
	'RedhatAccess.search',
	'RedhatAccess.logViewer',
	'RedhatAccess.tree-selector'
]).run(['TITLE_VIEW_CONFIG','$http',function(TITLE_VIEW_CONFIG,$http) {
	TITLE_VIEW_CONFIG.show = true;
}]);

//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template',[]);