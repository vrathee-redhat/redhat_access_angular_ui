'use strict';
/*jshint unused:vars */
angular.module("RedhatAccess.cases").controller("SolrInputController", [
    "$scope",
    function($scope) {
        $scope.successParse = false;
        $scope.inputQuery = "";

        $scope.$watch("inputQuery", function(query) {
            try {
                console.log("Query: '" + query + "'");
                grammar.parse(query);
                $scope.successParse = true;
            } catch (e) {
                $scope.successParse = false;
                $scope.error = e;
                $scope.autocomplete(e.expected);
            }
        });

        $scope.autocomplete = function(expecteds) {
            var autocomplete = [];
            if(expecteds!=null) {
                var ignored = [")", "(", " and ", " or ", "-", ":", '"'];
                angular.forEach(expecteds, function(expected) {
                    if(expected.type === "literal" && ignored.indexOf(expected.value) === -1) {
                        autocomplete.push(expected.value);
                    }
                });
            }

            $scope.autocompleteList = autocomplete.sort();
        };
    }
]);
