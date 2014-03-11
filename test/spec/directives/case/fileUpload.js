'use strict';

describe('Directive: case/fileUpload', function () {

  // load the directive's module
  beforeEach(module('redhatAccessAngularUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<case/file-upload></case/file-upload>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the case/fileUpload directive');
  }));
});
