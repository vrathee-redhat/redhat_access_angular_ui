angular.module('RedhatAccess', [
	'ngSanitize',
	'templates.app',
	'RedhatAccessCases',
	'RedhatAccess.security',
	'RedhatAccess.search',
	'logViewer'
])
	.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider.state('logviewer', {
				url: "/logviewer",
				templateUrl: 'log_viewer/views/log_viewer.html'
			})
		}
	]);