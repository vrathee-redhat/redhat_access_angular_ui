/*jshint camelcase: false */
'use strict';
/*jshint unused:vars */
/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search').directive('rhaResultdetaildisplay', [
    'RESOURCE_TYPES',
    function (RESOURCE_TYPES) {
        return {
            restrict: 'AE',
            scope: { result: '=' },
            link: function (scope, element, attr) {
                scope.isSolution = function () {
                    if (scope.result !== undefined && scope.result.resource_type !== undefined) {
                        if (scope.result.resource_type === RESOURCE_TYPES.solution) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                };
                scope.isArticle = function () {
                    if (scope.result !== undefined && scope.result.resource_type !== undefined) {
                        if (scope.result.resource_type === RESOURCE_TYPES.article) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                };
                scope.getSolutionResolution = function () {
                    var resolutionHtml = '';
                    if (scope.result.resolution !== undefined) {
                        resolutionHtml = scope.result.resolution.html;
                    }
                    return resolutionHtml;
                };
                scope.getArticleHtml = function () {
                    if (scope.result === undefined) {
                        return '';
                    }
                    if (scope.result.body !== undefined) {
                        if (scope.result.body.html !== undefined) {
                            //this is for newer version of strata
                            return scope.result.body.html;
                        } else {
                            //handle old markdown format
                            return scope.result.body;
                        }
                    } else {
                        return '';
                    }
                };

                scope.resultClickCapture = function(event, result) {
                    var target = event.target || event.srcElement; // srcElement === IE
                    var isAnchor = target && (target.nodeName && target.nodeName.toLowerCase() === 'a');
                    if (!isAnchor) {
                        // Don't care - bail.
                        return;
                    }
                    var hashRegex = /^#.*/,
                        absoluteRegex = /^http(s?):\/\//;
                    // target.href adds base uri - have to use getAttr('href')
                    var href = target.getAttribute('href');
                    if (hashRegex.test(href)) {
                        // Found a hash href (starts with #)
                        event.preventDefault();
                        var targetElem = angular.element(target.hash),
                            scrollElem = angular.element('#rha-solution-display');
                        if (targetElem.length && scrollElem.length) {
                            // We have a target element, and a scroll host
                            // set scroll of top of target element
                            scrollElem.scrollTop(targetElem.position().top);
                        } else if (targetElem.length) {
                            // No scroll host, just use native method that will scroll
                            // the window
                            targetElem[0].scrollIntoView();
                        }
                    } else if (!absoluteRegex.test(href)) {
                        // Found a relative href (does NOT start with http or https)
                        event.preventDefault();
                        if(href.indexOf('/') === 0) {
                            // Absolute url relative to result view_uri
                            // This is a very hacky way to get the base url from a url
                            var parser = document.createElement('a');
                            parser.href = result.view_uri;
                            target.href = parser.origin + href;
                        } else {
                            // Relative url relative to result view_uri
                            target.href = result.view_uri + href;
                        }
                        // Re-click target with newly constructed href
                        target.click();
                    }
                };
            },
            templateUrl: 'search/views/resultDetail.html'
        };
    }
]);
