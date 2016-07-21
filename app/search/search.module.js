'use strict';

import searchRouting from './search.routing'

const app = angular.module('RedhatAccess.search', [
    'ui.router',
    'ngAnimate',
    'RedhatAccess.template',
    'RedhatAccess.security',
    'ui.bootstrap',
    'ngSanitize',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
]);

// Routing
app.config(searchRouting);

// Constants
import SEARCH_PARAMS from './constants/searchParams'

app.constant('SEARCH_PARAMS', SEARCH_PARAMS);

// Values
import SEARCH_CONFIG from './values/searchConfig'

app.value('SEARCH_CONFIG', SEARCH_CONFIG);

// Controllers
import SearchController from './controllers/searchController'

app.controller('SearchController', SearchController);

// Directives
import rhaAccordionsearchresults from './directives/accordionSearchResults'
import rhaListsearchresults from './directives/listSearchResults'
import rhaResultdetaildisplay from './directives/resultDetailDisplay'
import rhaSearchform from './directives/searchForm'
import rhaStandardsearch from './directives/standardSearch'

app.directive('rhaAccordionsearchresults', rhaAccordionsearchresults);
app.directive('rhaListsearchresults', rhaListsearchresults);
app.directive('rhaResultdetaildisplay', rhaResultdetaildisplay);
app.directive('rhaSearchform', rhaSearchform);
app.directive('rhaStandardsearch', rhaStandardsearch);

// Factories
import SearchResultsService from './factories/searchResultsService'

app.factory('SearchResultsService', SearchResultsService);

export default app.name;
