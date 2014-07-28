'use strict';

describe('ui-utils  Directives:  TreeView', function () {



  var mockScope;
  var compileService;

  beforeEach(angular.mock.module('RedhatAccess.ui-utils'));
  beforeEach(angular.mock.module('common/views/treenode.html')); //load our template modules
  beforeEach(angular.mock.inject(function ($rootScope, $compile) {
    mockScope = $rootScope.$new();
    compileService = $compile;
    mockScope.attachmentTree = [{
      checked: true,
      name: 'node0',
      fullPath: 'node0',
      children: []
    }, {
      checked: false,
      name: 'node1',
      fullPath: '/node1',
      children: []
    }, {
      checked: false,
      name: 'folder',
      children: [{
        checked: false,
        name: 'child1',
        fullPath: 'folder/child1',
        children: []
      }, {
        checked: true,
        name: 'child2',
        fullPath: '/folder/child2',
        children: []
      }]
    }];
  }));

  it('should generate a tree view from a tree object', function () {
    var compileFn = compileService('<div rha-choicetree ng-model="attachmentTree"></div>');
    var elem = compileFn(mockScope);
    mockScope.$digest(); //Important so sync our data
    expect(elem.find('ul').length).toEqual(1); //we should have one root
    expect(elem.find('div[rha-choice]').length).toEqual(5); //we should have 5 nodes
    expect(elem.find('input').length).toEqual(4); //we have 4 checkboxes
    //first and last checkboxes must be prechecked:
    expect(elem.find('input').eq(0).attr('checked')).toBeDefined();
    expect(elem.find('input').eq(1).attr('checked')).toBeUndefined();
    expect(elem.find('input').eq(2).attr('checked')).toBeUndefined();
    expect(elem.find('input').eq(3).attr('checked')).toBeDefined();
  });
});