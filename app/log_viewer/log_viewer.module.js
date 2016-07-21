'use strict';

import logViewerRouting from './log_viewer.routing'

//var testURL = 'http://localhost:8080/LogCollector/';
const app = angular.module('RedhatAccess.logViewer', [
    'angularTreeview',
    'ngAnimate',
    'ui.bootstrap',
    'RedhatAccess.search',
    'RedhatAccess.header'
]);

// Routing
app.config(logViewerRouting);

// Constants
import LOGVIEWER_EVENTS from './constants/logviewerEvents'
app.constant('LOGVIEWER_EVENTS', LOGVIEWER_EVENTS);

// Values
import hideMachinesDropdown from './values/hideMachinesDropdown'
app.value('hideMachinesDropdown', hideMachinesDropdown);

// Controllers
import AccordionDemoCtrl from './controllers/AccordionDemoCtrl'
import DropdownCtrl from './controllers/DropdownCtrl'
import fileController from './controllers/fileController'
import logViewerController from './controllers/logViewerController'
import TabsDemoCtrl from './controllers/TabsDemoCtrl'

app.controller('AccordionDemoCtrl', AccordionDemoCtrl);
app.controller('DropdownCtrl', DropdownCtrl);
app.controller('fileController', fileController);
app.controller('logViewerController', logViewerController);
app.controller('TabsDemoCtrl', TabsDemoCtrl);

// Directives
import rhaFilldown from './directives/fillDown'
import rhaLogsinstructionpane from './directives/logsInstructionPane'
import rhaLogtabs from './directives/logTabs'
import rhaNavsidebar from './directives/navSideBar'
import rhaRecommendations from './directives/recommendations'

app.directive('rhaFilldown', rhaFilldown);
app.directive('rhaLogsinstructionpane', rhaLogsinstructionpane);
app.directive('rhaLogtabs', rhaLogtabs);
app.directive('rhaNavsidebar', rhaNavsidebar);
app.directive('rhaRecommendations', rhaRecommendations);

// Services
import accordian from './services/accordianService'

app.service('accordian', accordian);

// Factories
import files from './factories/fileService'

app.factory('files', files);

export default app.name;

