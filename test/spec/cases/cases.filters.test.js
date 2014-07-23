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

		var short_string = 'hello world';
		var long_string = 'hello world hello world hello world hello world  hello world hello world hello world hello world hello world hello world  hello world  hello world  hello world  hello world  hello world  hello world';
		var result_short;
		var result_long;


		result_short = $filter('recommendationsResolution')(short_string);
		result_long = $filter('recommendationsResolution')(long_string);

		expect(result_short).toEqual('hello world');
		expect(result_long).toEqual('hello world hello world hello world hello world  hello world hello world hello world hello world hello world hello world  hello world  hello world  he...');

	});
});