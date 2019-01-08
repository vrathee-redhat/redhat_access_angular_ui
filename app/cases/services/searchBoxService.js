'use strict';

export default class SearchBoxService {
    constructor($rootScope, CASE_EVENTS, RHAUtils) {
        'ngInject';
        
        this.onChange = function () {
            $rootScope.$broadcast(CASE_EVENTS.searchBoxChange);
            if (RHAUtils.isNotEmpty(this.searchTerm)) {
                this.disableSearchButton = false;
            } else {
                this.disableSearchButton = true;
            }
        };
        this.doSearch = function () {
            $rootScope.$broadcast(CASE_EVENTS.searchSubmit);
        };
        this.clear = () => {
            this.searchTerm = undefined;
        };
        this.searchTerm = undefined;
        this.onKeyPress = {};
        this.disableSearchButton = true;
    }
}
