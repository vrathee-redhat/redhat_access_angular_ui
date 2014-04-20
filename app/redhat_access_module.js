angular.module('RedhatAccess', [
	'ngSanitize',
	'RedhatAccess.template',
	'RedhatAccess.cases',
	'RedhatAccess.security',
	'RedhatAccess.search',
	'RedhatAccess.logViewer',
	'RedhatAccess.tree-selector'
]);

//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template',[]);