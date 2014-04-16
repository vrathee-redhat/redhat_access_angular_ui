var app = angular.module('RedhatAccess.tree-selector', []);

app.controller('TreeViewSelectorCtrl', ['TreeViewSelectorUtils', '$scope', '$http',
  function (TreeViewSelectorUtils, $scope, $http) {
    $scope.name = 'Attachments';
    $scope.attachmentTree = [];
    $scope.init = function () {
      $http({
        method: 'GET',
        url: 'attachments'
      }).success(function (data, status, headers, config) {
        var tree = new Array();
        TreeViewSelectorUtils.parseTreeList(tree, data);
        $scope.attachmentTree = tree;
      }).error(function (data, status, headers, config) {
        console.log("Unable to get supported attachments list");
      });
    };
    $scope.init();
  }
]);

app.directive('rhaChoiceTree', function () {
  return {
    template: '<ul><rha-choice ng-repeat="choice in tree"></rha-choice></ul>',
    replace: true,
    transclude: true,
    restrict: 'E',
    scope: {
      tree: '=ngModel'
    }
  };
});

app.directive('rhaChoice', function ($compile) {
  return {
    restrict: 'E',
    templateUrl: 'common/views/treenode.html',
    link: function (scope, elm, attrs) {
      scope.choiceClicked = function (choice) {
        choice.checked = !choice.checked;

        function checkChildren(c) {
          angular.forEach(c.children, function (c) {
            c.checked = choice.checked;
            checkChildren(c);
          });
        }
        checkChildren(choice);
      };
      if (scope.choice.children.length > 0) {
        var childChoice = $compile('<rha-choice-tree ng-show="!choice.collapsed" ng-model="choice.children"></rha-choice-tree>')(scope)
        elm.append(childChoice);
      }
    }
  };
});

app.service('TreeViewSelectorUtils',
  function () {
    var parseTreeNode = function (splitPath, tree, fullFilePath) {
      if (splitPath[0] != null) {
        if (splitPath[0] != "") {
          var node = splitPath[0];
          var match = false;
          var index = 0;
          for (var i = 0; i < tree.length; i++) {
            if (tree[i].name === node) {
              match = true;
              index = i;
              break;
            }
          }
          if (!match) {
            var nodeObj = new Object();
            nodeObj.checked = isLeafChecked(node);
            nodeObj.name = removeParams(node);
            if (splitPath.length == 1) {
              nodeObj.fullPath = removeParams(fullFilePath);
            }
            nodeObj.children = new Array();
            tree.push(nodeObj);
            index = tree.length - 1;
          }
          splitPath.shift();
          parseTreeNode(splitPath, tree[index].children, fullFilePath);
        } else {
          splitPath.shift();
          parseTreeNode(splitPath, tree, fullFilePath);
        }
      }
    };

    var removeParams = function (path) {
      if (path) {
        var split = path.split('?');
        return split[0];
      }
      return path;
    };

    var isLeafChecked = function (path) {
      if (path) {
        var split = path.split('?');
        if (split[1]) {
          var params = split[1].split('&');
          for (var i = 0; i < params.length; i++) {
            if (params[i].indexOf("checked=true") != -1) {
              return true;
            }
          }
        }
      }
      return false;
    };

    var hasSelectedLeaves = function (tree) {

      for (var i = 0; i < tree.length; i++) {
        if (tree[i] !== undefined) {
          if (tree[i].children.length === 0) {
            //we only check leaf nodes
            if (tree[i].checked === true) {
              return true;
            }
          } else {
            if (hasSelectedLeaves(tree[i].children)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    var getSelectedNames = function (tree, container) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] !== undefined) {
          if (tree[i].children.length === 0) {
            if (tree[i].checked === true) {
              container.push(tree[i].fullPath);
            }
          } else {
            getSelectedNames(tree[i].children, container);
          }
        }
      }
    };

    var service = {
      parseTreeList: function (tree, data) {
        var files = data.split("\n");
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var splitPath = file.split("/");
          parseTreeNode(splitPath, tree, file);
        }
      },
      hasSelections: function (tree) {
        return hasSelectedLeaves(tree);
      },
      getSelectedLeaves: function (tree) {
        if (tree === undefined) {
          console.log("getSelectedLeaves: Invalid tree");
          return [];
        }
        var container = [];
        getSelectedNames(tree, container);
        return container;
      }
    };
    return service;
  });

app.config(function ($urlRouterProvider) {}).config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('choiceSelector', {
      url: "/treeselector",
      templateUrl: 'common/views/treeview-selector.html'
    })
  }
]);