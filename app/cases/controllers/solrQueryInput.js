'use strict';
/*jshint unused:vars */
angular.module("RedhatAccess.cases").controller("SolrQueryInputController", [
    "$scope",
    '$rootScope',
    "SOLRGrammarService",
    'RHAUtils',
    '$timeout',
    'CASE_EVENTS',
    function($scope,$rootScope, SOLRGrammarService, RHAUtils, $timeout,CASE_EVENTS) {
        $scope.parseSuccessful = false;
        $scope.inputQuery = "";
        $scope.showingCompletionList = true;
        $scope.CASE_EVENTS = CASE_EVENTS;
        $scope.RHAUtils = RHAUtils;

        $scope.changeSolrQuery = function (query) {
          $scope.solrQuery = query;
        };

        $scope.$watch("inputQuery", function(query) {
            try {
                var solrquery = SOLRGrammarService.parse(query);
                $scope.changeSolrQuery(solrquery);
                $scope.parseSuccessful = true;

                // trigger further autocompletion by adding a whitespace
              try {
                  SOLRGrammarService.parse(query + " ");
              } catch (e) {
                  $scope.error = e;
                  $scope.autocomplete(e.expected);
              }
            } catch (e) {
                $scope.changeSolrQuery(null);
                $scope.parseSuccessful = false;
                $scope.error = e;
                $scope.autocomplete(e.expected, query.substring(e.location.start.offset, query.length));
            }
        });

        $scope.autocomplete = function(expecteds, phrase) {
            var autocomplete = [];
            var info = "";
            var andIsPresent = false;
            var orIsPresent = false;

            if(expecteds!=null) {
                var ignored = [")", "(", "-", ":", '"', ' ','[',']'];
                angular.forEach(expecteds, function(expected) {
                    if(expected.type === "literal" && ignored.indexOf(expected.value) === -1) {
                        autocomplete.push(expected.value);
                        info = "Choose one of the displayed options.";
                    } else if (expected.value === '"') {
                        info = "Values containing whitespaces have to be wraped in double quotes.";
                    }

                    if(expected.value === " and ") {
                        andIsPresent = true
                    } else if(expected.value === " or ") {
                        orIsPresent = true;
                    }
                });

                if(andIsPresent && orIsPresent) {
                    info = "Enter <b>and</b> or <b>or</b> to continue with the query.";
                } else if (andIsPresent) {
                    info = "Enter <b>and</b> to continue with the query.";
                } else if (orIsPresent) {
                    info = "Enter <b>or</b> to continue with the query.";
                }
            }

            $scope.autocompleteList = autocomplete.sort();
            if(phrase !== undefined && RHAUtils.isNotEmpty(phrase.trim())) {
                $scope.autocompleteList = $scope.autocompleteList.filter(function (item) {
                    return item.toLowerCase().indexOf(phrase.trim().toLowerCase()) >= 0;
                })
            }
            $scope.info = info;
        };

        var selectNextItem = function (next) {
            var nextDiff = next || 1;
            var selectedId = $scope.selectedItem;

            //select next item
            var nextId;
            if(selectedId !== null) {
                nextId = (selectedId + nextDiff + $scope.autocompleteList.length) % $scope.autocompleteList.length;
            } else {
                nextId = nextDiff === 1 ? 0 : $scope.autocompleteList.length - 1;
            }

            $scope.selectItem(nextId);

        };

        $scope.keyPress = function (e) {
            if(e.keyCode===38) { // key UP
                e.preventDefault();
                e.stopPropagation();
                selectNextItem(-1);
                return false;
            } else if (e.keyCode === 40) { // key DOWN
                e.preventDefault();
                e.stopPropagation();
                selectNextItem();
                return false;
            } else if (e.keyCode === 13) { //key ENTER
                e.preventDefault();
                e.stopPropagation();
                if (RHAUtils.isNotEmpty($scope.selectedItem)) {
                    $scope.clickedItem($scope.selectedItem);
                }
                return false;
            }
        };

        // autocomplete
        $scope.selectedItem = null;

        $scope.clickedItem = function (id) {
            var item = $scope.autocompleteList[id];
            if(RHAUtils.isNotEmpty(item)) {
              $scope.inputQuery = $scope.inputQuery.substring(0, $scope.error.location.start.offset) + item;
              //put focus back to the input
              $scope.$broadcast(CASE_EVENTS.focusSearchInput);
            }

        };

        $scope.selectItem = function (id) {
            $scope.selectedItem = id;
        };

        $scope.showCompletionList = function () {
            $scope.showingCompletionList = true;
        };

        $scope.hideCompletionList = function () {
          $timeout(function () {
              $scope.showingCompletionList = false;
          }, 100);
        };
    }
]);
