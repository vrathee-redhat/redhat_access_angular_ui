'use strict';
describe('Case Filters: recommendationsResolution', function () {
    var $filter;
    beforeEach(function () {
        angular.mock.module('RedhatAccess.cases');
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });
    it('should limit recommendation text to 150 characters ', function () {
        var shortString = 'hello world';
        var longString = 'hello world hello world hello world hello world  hello world hello world hello world hello world hello world hello world  hello world  hello world  hello world  hello world  hello world  hello world';
        var resultShort;
        var resultLong;
        resultShort = $filter('recommendationsResolution')(shortString);
        resultLong = $filter('recommendationsResolution')(longString);
        expect(resultShort).toEqual('hello world');
        expect(resultLong).toEqual('hello world hello world hello world hello world  hello world hello world hello world hello world hello world hello world  hello world  hello world  he...');
    });
});
