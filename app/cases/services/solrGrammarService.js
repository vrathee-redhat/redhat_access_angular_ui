"use strict";
angular.module("RedhatAccess.cases").service("SOLRGrammarService",[
	function () {
		this.parse = function () {
			if(grammar === undefined) throw "Grammar not defined";

			return grammar.parse.apply(grammar, arguments);
		}
	}
]);
