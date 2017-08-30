(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["hydrajs"] = factory();
	else
		root["hydrajs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var comment_1 = __webpack_require__(13);
	var insights_1 = __webpack_require__(18);
	var roleMetadata_1 = __webpack_require__(24);
	var testClass_1 = __webpack_require__(30);
	var general_1 = __webpack_require__(16);
	var kyce_1 = __webpack_require__(20);
	var businessHours_1 = __webpack_require__(8);
	var tags_1 = __webpack_require__(28);
	var user_1 = __webpack_require__(31);
	var kcs_1 = __webpack_require__(19);
	var case_1 = __webpack_require__(10);
	var shiftMetadata_1 = __webpack_require__(26);
	var templateMetadata_1 = __webpack_require__(29);
	var vendorProduct_1 = __webpack_require__(33);
	var certification_1 = __webpack_require__(11);
	var certificationTest_1 = __webpack_require__(12);
	var userShifts_1 = __webpack_require__(32);
	var groupMetadata_1 = __webpack_require__(17);
	var counts_1 = __webpack_require__(14);
	var review_1 = __webpack_require__(23);
	var products_1 = __webpack_require__(22);
	var sbrs_1 = __webpack_require__(25);
	var externalTrackers_1 = __webpack_require__(15);
	var solr_1 = __webpack_require__(27);
	var account_1 = __webpack_require__(7);
	var callCenters_1 = __webpack_require__(9);
	var commentFeedback_1 = __webpack_require__(21);
	exports.default = {
	    general: {
	        health: general_1.health,
	        hostname: general_1.hostname
	    },
	    kase: {
	        getComments: comment_1.getComments,
	        upsertComment: comment_1.upsertComment,
	        getCase: case_1.getCase,
	        getCases: case_1.getCases,
	        updateCase: case_1.updateCase,
	        getLinkedJiras: case_1.getLinkedJiras,
	        linkJiraToCase: case_1.linkJiraToCase,
	        deleteJiraLinkFromCase: case_1.deleteJiraLinkFromCase,
	        getEscalations: case_1.getEscalations,
	        counts: {
	            articlesLinked: counts_1.articlesLinked,
	            bomgarSessions: counts_1.bomgarSessions,
	            bugzillas: counts_1.bugzillas,
	            caseHistory: counts_1.caseHistory,
	            chatTranscripts: counts_1.chatTranscripts,
	            comments: counts_1.comments,
	            escalationsClosed: counts_1.escalationsClosed,
	            escalationsOpen: counts_1.escalationsOpen,
	            fileAttachments: counts_1.fileAttachments,
	            jiras: counts_1.jiras,
	            solutionsLinked: counts_1.solutionsLinked,
	            teamMembers: counts_1.teamMembers,
	            reviews: counts_1.reviews
	        },
	        getLanguages: case_1.getLanguages,
	        getSeverities: case_1.getSeverities,
	        getStatuses: case_1.getStatuses,
	        getTypes: case_1.getTypes,
	        getCaseExternalTrackers: case_1.getCaseExternalTrackers,
	        getCaseExternalTrackerUpdates: case_1.getCaseExternalTrackerUpdates,
	        getCaseContacts: case_1.getCaseContacts,
	        addCaseContacts: case_1.addCaseContacts,
	        deleteCaseContacts: case_1.deleteCaseContacts,
	        getAccountCaseGroups: case_1.getAccountCaseGroups,
	        getHistory: case_1.getHistory,
	        getAssociates: case_1.getAssociates,
	        addAssociate: case_1.addAssociate,
	        deleteAssociate: case_1.deleteAssociate,
	        updateOwner: case_1.updateOwner
	    },
	    insights: {
	        runInsights: insights_1.runInsights,
	        getInsightsRules: insights_1.getInsightsRules,
	    },
	    skedge: {
	        getAllShiftMetadatas: shiftMetadata_1.getAllShiftMetadatas,
	        createShiftMetadata: shiftMetadata_1.createShiftMetadata,
	        updateShiftMetadata: shiftMetadata_1.updateShiftMetadata,
	        deleteShiftMetadata: shiftMetadata_1.deleteShiftMetadata,
	        getAllRoleMetadatas: roleMetadata_1.getAllRoleMetadatas,
	        getAllTemplateMetadatas: templateMetadata_1.getAllTemplateMetadatas,
	        getTemplateMetadatasForUser: templateMetadata_1.getTemplateMetadatasForUser,
	        postCustomTemplateForUser: templateMetadata_1.postCustomTemplateForUser,
	        getAllShiftsForUsers: userShifts_1.getAllShiftsForUsers,
	        getShiftsForUserFilters: userShifts_1.getShiftsForUserFilters,
	        postShiftsForUsers: userShifts_1.postShiftsForUsers,
	        editShiftForUser: userShifts_1.editShiftForUser,
	        deleteShiftByShiftId: userShifts_1.deleteShiftByShiftId,
	        deleteShiftForUsers: userShifts_1.deleteShiftForUsers,
	        getAllGroupMetadatas: groupMetadata_1.getAllGroupMetadatas,
	        getGroupsForOwner: groupMetadata_1.getGroupsForOwner,
	        postGroupDetails: groupMetadata_1.postGroupDetails,
	        updateGroupDetails: groupMetadata_1.updateGroupDetails,
	        deleteGroupByGroupId: groupMetadata_1.deleteGroupByGroupId,
	    },
	    certification: {
	        getCertification: certification_1.getCertification,
	        createCertification: certification_1.createCertification,
	        updateCertification: certification_1.updateCertification,
	        createHardwareCertification: certification_1.createHardwareCertification,
	        updateHardwareCertification: certification_1.updateHardwareCertification,
	        getHardwareCertification: certification_1.getHardwareCertification,
	        createOpenStackCertification: certification_1.createOpenStackCertification,
	        updateOpenStackCertification: certification_1.updateOpenStackCertification,
	        getOpenStackCertification: certification_1.getOpenStackCertification,
	        getCertifications: vendorProduct_1.getCertifications,
	        getOpenStackApi: certification_1.getOpenStackApi,
	        getOpenStackFeature: certification_1.getOpenStackFeature,
	        getOpenStackProtocol: certification_1.getOpenStackProtocol,
	        getVendorProduct: vendorProduct_1.getVendorProduct,
	        createVendorProduct: vendorProduct_1.createVendorProduct,
	        updateVendorProduct: vendorProduct_1.updateVendorProduct,
	        getTestClasses: testClass_1.getTestClasses,
	        getComponents: vendorProduct_1.getComponents,
	        upsertComponents: vendorProduct_1.upsertComponents,
	        getCertificationTestPlans: certificationTest_1.getCertificationTestPlans,
	        upsertCertificationTestPlans: certificationTest_1.upsertCertificationTestPlans,
	        getCertificationTestData: certificationTest_1.getCertificationTestData,
	        getProgram: certification_1.getProgram,
	        getPrograms: certification_1.getPrograms,
	        getRedHatProduct: certification_1.getRedHatProduct,
	        getRedHatProducts: certification_1.getRedHatProducts,
	        getRedHatVersion: certification_1.getRedHatVersion,
	        getRedHatVersions: certification_1.getRedHatVersions,
	        getPlatform: certification_1.getPlatform,
	        getPlatforms: certification_1.getPlatforms,
	    },
	    review: {
	        getQuestions: review_1.getQuestions,
	        getKtQuestions: review_1.getKtQuestions,
	        getReviews: review_1.getReviews,
	        createReview: review_1.createReview
	    },
	    users: {
	        getUsers: user_1.getUsers,
	        getUserById: user_1.getUserById,
	        getUserBySSO: user_1.getUserBySSO,
	        getCaseGroups: user_1.getCaseGroups,
	        getRoles: user_1.getRoles,
	        updateUser: user_1.updateUser
	    },
	    kyce: {
	        runKyce: kyce_1.runKyce
	    },
	    commentFeedback: {
	        createCommentFeedback: commentFeedback_1.createCommentFeedback,
	        updateCommentFeedback: commentFeedback_1.updateCommentFeedback,
	        getCommentFeedback: commentFeedback_1.getCommentFeedback
	    },
	    kcs: {
	        linkKcsResources: kcs_1.linkKcsResources,
	        getSolution: kcs_1.getSolution
	    },
	    products: {
	        getProducts: products_1.getProducts,
	        getProductVersions: products_1.getProductVersions
	    },
	    sbrs: {
	        getSbr: sbrs_1.getSbr,
	        getSbrs: sbrs_1.getSbrs
	    },
	    externalTrackers: {
	        getExternalTrackers: externalTrackers_1.getExternalTrackers,
	        getExternalTrackersUpdates: externalTrackers_1.getExternalTrackersUpdates
	    },
	    solr: {
	        getSolrAccess: solr_1.getSolrAccess,
	        getSolrCases: solr_1.getSolrCases
	    },
	    accounts: {
	        getAccount: account_1.getAccount,
	        getAccountContacts: account_1.getAccountContacts
	    },
	    businessHours: {
	        getBusinessHours: businessHours_1.getBusinessHours
	    },
	    tags: {
	        getTags: tags_1.getTags
	    },
	    callcenters: {
	        getCallCenters: callCenters_1.getCallCenters,
	        getCallCenter: callCenters_1.getCallCenter
	    }
	};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// Since we aren't transpiling to babel can't use ES6 imports here
	var Uri = __webpack_require__(5);
	var btoa = __webpack_require__(3);
	function createBasicAuth(user, pass) {
	    return "Basic " + btoa(user + ':' + pass);
	}
	exports.createBasicAuth = createBasicAuth;
	var hydraHostName = new Uri('');
	var pathPrefix = '/hydra/rest';
	var auth = null;
	if (process && ({"NODE_ENV":"production"}) && ({"NODE_ENV":"production"}).RHN_USER) {
	    auth = createBasicAuth(({"NODE_ENV":"production"}).RHN_USER, ({"NODE_ENV":"production"}).RHN_PASS);
	}
	if (process && ({"NODE_ENV":"production"}) && ({"NODE_ENV":"production"}).HYDRA_HOSTNAME) {
	    hydraHostName = new Uri(({"NODE_ENV":"production"}).HYDRA_HOSTNAME);
	}
	else if (typeof window !== 'undefined' && window) {
	    if (window.location.hostname === 'access.redhat.com' || window.location.hostname === 'prod.foo.redhat.com' || window.location.hostname === 'fooprod.redhat.com' || window.location.hostname === 'skedge.redhat.com') {
	        hydraHostName = new Uri('https://hydraadmin-corp-redhat-com.vserver.prod.ext.phx2.redhat.com/hydra/rest/');
	    }
	    else if (window.location.hostname === 'access.qa.redhat.com' || window.location.hostname === 'qa.foo.redhat.com' || window.location.hostname === 'fooqa.redhat.com' || window.location.hostname === 'skedge.qa.redhat.com') {
	        hydraHostName = new Uri('https://hydraadmin-corp-qa-redhat-com.vserver.qa.ext.phx1.redhat.com/hydra/rest/');
	    }
	    else if (window.location.hostname === 'access.devgssfte.devlab.phx1.redhat.com' || window.location.hostname === 'fte.foo.redhat.com' || window.location.hostname === 'foofte.redhat.com') {
	        hydraHostName = new Uri('https://hydraadmin-corp-dev-redhat-com.vserver.devlab.ext.phx1.redhat.com/hydra/rest/');
	    }
	    else if (window.location.hostname === 'access.devgssci.devlab.phx1.redhat.com' || window.location.hostname === 'ci.foo.redhat.com' || window.location.hostname === 'fooci.redhat.com' || window.location.hostname === 'skedge.ci.redhat.com') {
	        hydraHostName = new Uri('https://hydraadmin-corp-dev-redhat-com.vserver.devlab.ext.phx1.redhat.com/hydra/rest/');
	    }
	    else if (window.location.hostname === 'access.stage.redhat.com' || window.location.hostname === 'stage.foo.redhat.com' || window.location.hostname === 'foostage.redhat.com' || window.location.hostname === 'skedge.stage.redhat.com') {
	        hydraHostName = new Uri('https://hydraadmin-corp-stage-redhat-com.vserver.stage.ext.phx2.redhat.com/hydra/rest/');
	    }
	}
	else {
	    throw new Error('Could not determine hostname, if you are running in Node make sure to set the HYDRA_HOSTNAME, RHN_USER, and RHN_PASS env variables.');
	}
	var Env = (function () {
	    function Env() {
	    }
	    Env.hydraHostName = hydraHostName;
	    Env.pathPrefix = pathPrefix;
	    Env.auth = auth;
	    return Env;
	}());
	exports.default = Env;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// Since we aren't transpiling to babel can't use ES6 imports here.  Also we can't specify the Response and Request
	// types for fetch since A) They happen automatically with import which we can't use and B) the reference paths would
	// be different in downstream apps
	var fetch = __webpack_require__(4);
	var env_1 = __webpack_require__(1);
	function errorHandler(response) {
	    return response.text().then(function (body) {
	        if (body == null || body === '')
	            throw new Error(body);
	        var parsedError;
	        try {
	            parsedError = JSON.parse(body);
	        }
	        catch (e) { }
	        var error = new Error((parsedError && parsedError.message) || body);
	        if (parsedError) {
	            Object.assign(error, parsedError);
	        }
	        throw error;
	    });
	}
	// If the token is expiring within 5 seconds, go ahead and refresh it.  Using 5 seconds as that is what keycloak uses as the default minValidity
	function isTokenExpired() {
	    return (window.sessionjs && window.sessionjs._state && window.sessionjs._state.keycloak && window.sessionjs._state.keycloak.isTokenExpired(5) === true);
	}
	function forceTokenRefresh() {
	    console.warn("Hydrajs detected the JWT token has expired, forcing an update");
	    // -1 here forces the token to refresh
	    return window.sessionjs._state.keycloak.updateToken(-1);
	}
	function getToken() {
	    if (window.sessionjs && window.sessionjs._state.keycloak.token) {
	        if (window.sessionjs.isAuthenticated()) {
	            return "Bearer " + window.sessionjs._state.keycloak.token;
	        }
	    }
	    return null;
	}
	function responseHandler(response) {
	    if (response.status === 500) {
	        return errorHandler(response);
	    }
	    else if (response.status === 204) {
	        return null;
	    }
	    else if (response.status === 200 || response.status === 201) {
	        return response.clone().text().then(function (body) {
	            if (body == null || body === '')
	                return null;
	            // Safari must implement the fetch API differently than Chrome/FF as Safari doesn't like the response to
	            // ever be cloned.  Therefore, if the clone fails here, we can just return the response.json()
	            try {
	                return response.clone().json().catch(function (e) {
	                    // The only possible error here is either response is null or parsing json fails.  Both of which
	                    // we just want to return the response, which would either be null or the actual api error
	                    return errorHandler(response);
	                });
	            }
	            catch (e) {
	                return response.json().catch(function (e) {
	                    // The only possible error here is either response is null or parsing json fails.  Both of which
	                    // we just want to return the response, which would either be null or the actual api error
	                    return errorHandler(response);
	                });
	            }
	        });
	    }
	    else {
	        return errorHandler(response);
	    }
	}
	function callFetchAndHandleJwt(uri, params) {
	    if (env_1.default.auth) {
	        params.headers['Authorization'] = env_1.default.auth;
	    }
	    else if (getToken()) {
	        params.headers['Authorization'] = getToken();
	    }
	    else {
	        console.warn("Could not set JWT token on request header, unauthenticated.");
	    }
	    if (!env_1.default.auth && isTokenExpired()) {
	        return forceTokenRefresh().success(function () {
	            params.headers['Authorization'] = getToken();
	            return fetch(uri.toString(), params).then(responseHandler);
	        }).error(function () {
	            // Even if there was an error updating the token, we still need to hit Hydra, which at this point would probably return the "JWT expired" though this edge case is very unlikely.
	            return fetch(uri.toString(), params).then(responseHandler);
	        });
	    }
	    else {
	        // Else we have a valid token and continue as always.
	        return fetch(uri.toString(), params).then(responseHandler);
	    }
	}
	function getUri(uri, headerParams) {
	    var params = {
	        credentials: 'include',
	        headers: {}
	    };
	    if (headerParams !== undefined) {
	        headerParams.forEach(function (element) {
	            params.headers[element.key] = element.value;
	        });
	    }
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.getUri = getUri;
	function postUri(uri, body) {
	    var params = {
	        method: 'POST',
	        credentials: 'include',
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(body)
	    };
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.postUri = postUri;
	function putUri(uri, body) {
	    var params = {
	        method: 'PUT',
	        credentials: 'include',
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(body)
	    };
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.putUri = putUri;
	function patchUri(uri, body) {
	    var params = {
	        method: 'PATCH',
	        credentials: 'include',
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(body)
	    };
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.patchUri = patchUri;
	function deleteUri(uri) {
	    var params = {
	        method: 'DELETE',
	        credentials: 'include',
	        headers: {
	            'Content-Type': 'application/json'
	        }
	    };
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.deleteUri = deleteUri;
	function deleteUriWithBody(uri, body) {
	    var params = {
	        method: 'DELETE',
	        credentials: 'include',
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(body)
	    };
	    return callFetchAndHandleJwt(uri, params);
	}
	exports.deleteUriWithBody = deleteUriWithBody;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = function _btoa(str) {
	  return btoa(str)
	}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(34);
	module.exports = self.fetch.bind(self);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jsUri
	 * https://github.com/derek-watson/jsUri
	 *
	 * Copyright 2013, Derek Watson
	 * Released under the MIT license.
	 *
	 * Includes parseUri regular expressions
	 * http://blog.stevenlevithan.com/archives/parseuri
	 * Copyright 2007, Steven Levithan
	 * Released under the MIT license.
	 */

	 /*globals define, module */

	(function(global) {

	  var re = {
	    starts_with_slashes: /^\/+/,
	    ends_with_slashes: /\/+$/,
	    pluses: /\+/g,
	    query_separator: /[&;]/,
	    uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	  };

	  /**
	   * Define forEach for older js environments
	   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
	   */
	  if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function(callback, thisArg) {
	      var T, k;

	      if (this == null) {
	        throw new TypeError(' this is null or not defined');
	      }

	      var O = Object(this);
	      var len = O.length >>> 0;

	      if (typeof callback !== "function") {
	        throw new TypeError(callback + ' is not a function');
	      }

	      if (arguments.length > 1) {
	        T = thisArg;
	      }

	      k = 0;

	      while (k < len) {
	        var kValue;
	        if (k in O) {
	          kValue = O[k];
	          callback.call(T, kValue, k, O);
	        }
	        k++;
	      }
	    };
	  }

	  /**
	   * unescape a query param value
	   * @param  {string} s encoded value
	   * @return {string}   decoded value
	   */
	  function decode(s) {
	    if (s) {
	        s = s.toString().replace(re.pluses, '%20');
	        s = decodeURIComponent(s);
	    }
	    return s;
	  }

	  /**
	   * Breaks a uri string down into its individual parts
	   * @param  {string} str uri
	   * @return {object}     parts
	   */
	  function parseUri(str) {
	    var parser = re.uri_parser;
	    var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
	    var m = parser.exec(str || '');
	    var parts = {};

	    parserKeys.forEach(function(key, i) {
	      parts[key] = m[i] || '';
	    });

	    return parts;
	  }

	  /**
	   * Breaks a query string down into an array of key/value pairs
	   * @param  {string} str query
	   * @return {array}      array of arrays (key/value pairs)
	   */
	  function parseQuery(str) {
	    var i, ps, p, n, k, v, l;
	    var pairs = [];

	    if (typeof(str) === 'undefined' || str === null || str === '') {
	      return pairs;
	    }

	    if (str.indexOf('?') === 0) {
	      str = str.substring(1);
	    }

	    ps = str.toString().split(re.query_separator);

	    for (i = 0, l = ps.length; i < l; i++) {
	      p = ps[i];
	      n = p.indexOf('=');

	      if (n !== 0) {
	        k = decode(p.substring(0, n));
	        v = decode(p.substring(n + 1));
	        pairs.push(n === -1 ? [p, null] : [k, v]);
	      }

	    }
	    return pairs;
	  }

	  /**
	   * Creates a new Uri object
	   * @constructor
	   * @param {string} str
	   */
	  function Uri(str) {
	    this.uriParts = parseUri(str);
	    this.queryPairs = parseQuery(this.uriParts.query);
	    this.hasAuthorityPrefixUserPref = null;
	  }

	  /**
	   * Define getter/setter methods
	   */
	  ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
	    Uri.prototype[key] = function(val) {
	      if (typeof val !== 'undefined') {
	        this.uriParts[key] = val;
	      }
	      return this.uriParts[key];
	    };
	  });

	  /**
	   * if there is no protocol, the leading // can be enabled or disabled
	   * @param  {Boolean}  val
	   * @return {Boolean}
	   */
	  Uri.prototype.hasAuthorityPrefix = function(val) {
	    if (typeof val !== 'undefined') {
	      this.hasAuthorityPrefixUserPref = val;
	    }

	    if (this.hasAuthorityPrefixUserPref === null) {
	      return (this.uriParts.source.indexOf('//') !== -1);
	    } else {
	      return this.hasAuthorityPrefixUserPref;
	    }
	  };

	  Uri.prototype.isColonUri = function (val) {
	    if (typeof val !== 'undefined') {
	      this.uriParts.isColonUri = !!val;
	    } else {
	      return !!this.uriParts.isColonUri;
	    }
	  };

	  /**
	   * Serializes the internal state of the query pairs
	   * @param  {string} [val]   set a new query string
	   * @return {string}         query string
	   */
	  Uri.prototype.query = function(val) {
	    var s = '', i, param, l;

	    if (typeof val !== 'undefined') {
	      this.queryPairs = parseQuery(val);
	    }

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (s.length > 0) {
	        s += '&';
	      }
	      if (param[1] === null) {
	        s += param[0];
	      } else {
	        s += param[0];
	        s += '=';
	        if (typeof param[1] !== 'undefined') {
	          s += encodeURIComponent(param[1]);
	        }
	      }
	    }
	    return s.length > 0 ? '?' + s : s;
	  };

	  /**
	   * returns the first query param value found for the key
	   * @param  {string} key query key
	   * @return {string}     first value found for key
	   */
	  Uri.prototype.getQueryParamValue = function (key) {
	    var param, i, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        return param[1];
	      }
	    }
	  };

	  /**
	   * returns an array of query param values for the key
	   * @param  {string} key query key
	   * @return {array}      array of values
	   */
	  Uri.prototype.getQueryParamValues = function (key) {
	    var arr = [], i, param, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        arr.push(param[1]);
	      }
	    }
	    return arr;
	  };

	  /**
	   * removes query parameters
	   * @param  {string} key     remove values for key
	   * @param  {val}    [val]   remove a specific value, otherwise removes all
	   * @return {Uri}            returns self for fluent chaining
	   */
	  Uri.prototype.deleteQueryParam = function (key, val) {
	    var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {

	      param = this.queryPairs[i];
	      keyMatchesFilter = decode(param[0]) === decode(key);
	      valMatchesFilter = param[1] === val;

	      if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
	        arr.push(param);
	      }
	    }

	    this.queryPairs = arr;

	    return this;
	  };

	  /**
	   * adds a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.addQueryParam = function (key, val, index) {
	    if (arguments.length === 3 && index !== -1) {
	      index = Math.min(index, this.queryPairs.length);
	      this.queryPairs.splice(index, 0, [key, val]);
	    } else if (arguments.length > 0) {
	      this.queryPairs.push([key, val]);
	    }
	    return this;
	  };

	  /**
	   * test for the existence of a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.hasQueryParam = function (key) {
	    var i, len = this.queryPairs.length;
	    for (i = 0; i < len; i++) {
	      if (this.queryPairs[i][0] == key)
	        return true;
	    }
	    return false;
	  };

	  /**
	   * replaces query param values
	   * @param  {string} key         key to replace value for
	   * @param  {string} newVal      new value
	   * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
	    var index = -1, len = this.queryPairs.length, i, param;

	    if (arguments.length === 3) {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
	          index = i;
	          break;
	        }
	      }
	      if (index >= 0) {
	        this.deleteQueryParam(key, decode(oldVal)).addQueryParam(key, newVal, index);
	      }
	    } else {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key)) {
	          index = i;
	          break;
	        }
	      }
	      this.deleteQueryParam(key);
	      this.addQueryParam(key, newVal, index);
	    }
	    return this;
	  };

	  /**
	   * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
	   */
	  ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
	    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
	    Uri.prototype[method] = function(val) {
	      this[key](val);
	      return this;
	    };
	  });

	  /**
	   * Scheme name, colon and doubleslash, as required
	   * @return {string} http:// or possibly just //
	   */
	  Uri.prototype.scheme = function() {
	    var s = '';

	    if (this.protocol()) {
	      s += this.protocol();
	      if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
	        s += ':';
	      }
	      s += '//';
	    } else {
	      if (this.hasAuthorityPrefix() && this.host()) {
	        s += '//';
	      }
	    }

	    return s;
	  };

	  /**
	   * Same as Mozilla nsIURI.prePath
	   * @return {string} scheme://user:password@host:port
	   * @see  https://developer.mozilla.org/en/nsIURI
	   */
	  Uri.prototype.origin = function() {
	    var s = this.scheme();

	    if (this.userInfo() && this.host()) {
	      s += this.userInfo();
	      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
	        s += '@';
	      }
	    }

	    if (this.host()) {
	      s += this.host();
	      if (this.port() || (this.path() && this.path().substr(0, 1).match(/[0-9]/))) {
	        s += ':' + this.port();
	      }
	    }

	    return s;
	  };

	  /**
	   * Adds a trailing slash to the path
	   */
	  Uri.prototype.addTrailingSlash = function() {
	    var path = this.path() || '';

	    if (path.substr(-1) !== '/') {
	      this.path(path + '/');
	    }

	    return this;
	  };

	  /**
	   * Serializes the internal state of the Uri object
	   * @return {string}
	   */
	  Uri.prototype.toString = function() {
	    var path, s = this.origin();

	    if (this.isColonUri()) {
	      if (this.path()) {
	        s += ':'+this.path();
	      }
	    } else if (this.path()) {
	      path = this.path();
	      if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
	        s += '/';
	      } else {
	        if (s) {
	          s.replace(re.ends_with_slashes, '/');
	        }
	        path = path.replace(re.starts_with_slashes, '/');
	      }
	      s += path;
	    } else {
	      if (this.host() && (this.query().toString() || this.anchor())) {
	        s += '/';
	      }
	    }
	    if (this.query().toString()) {
	      s += this.query().toString();
	    }

	    if (this.anchor()) {
	      if (this.anchor().indexOf('#') !== 0) {
	        s += '#';
	      }
	      s += this.anchor();
	    }

	    return s;
	  };

	  /**
	   * Clone a Uri object
	   * @return {Uri} duplicate copy of the Uri
	   */
	  Uri.prototype.clone = function() {
	    return new Uri(this.toString());
	  };

	  /**
	   * export via AMD or CommonJS, otherwise leak a global
	   */
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Uri;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = Uri;
	  } else {
	    global.Uri = Uri;
	  }
	}(this));


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAccount(accountNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber);
	    return fetch_1.getUri(uri);
	}
	exports.getAccount = getAccount;
	function getAccountContacts(accountNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber + "/contacts");
	    return fetch_1.getUri(uri);
	}
	exports.getAccountContacts = getAccountContacts;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getBusinessHours(timezone) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/businesshours");
	    uri.addQueryParam('timezone', timezone);
	    return fetch_1.getUri(uri);
	}
	exports.getBusinessHours = getBusinessHours;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getCallCenters() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/callcenters");
	    return fetch_1.getUri(uri);
	}
	exports.getCallCenters = getCallCenters;
	function getCallCenter(callCenterId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/callcenters/" + callCenterId);
	    return fetch_1.getUri(uri);
	}
	exports.getCallCenter = getCallCenter;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	// caseId can be id or case number
	// Note that fields can't currently be Fields<ICase> since we don't actively type each field and sub relationship field
	function getCase(caseId, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId);
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getCase = getCase;
	function getCases(filters, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases");
	    if (filters && Object.keys(filters).length > 0) {
	        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
	            var key = _a[_i];
	            uri.addQueryParam(key, filters[key]);
	        }
	    }
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getCases = getCases;
	function updateCase(caseId, kase) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId);
	    return fetch_1.putUri(uri, kase);
	}
	exports.updateCase = updateCase;
	function getLinkedJiras(caseId, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/jiras");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getLinkedJiras = getLinkedJiras;
	function linkJiraToCase(caseId, newLink) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/jira");
	    return fetch_1.postUri(uri, newLink);
	}
	exports.linkJiraToCase = linkJiraToCase;
	function deleteJiraLinkFromCase(caseId, issueKey) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/jira/" + issueKey);
	    return fetch_1.deleteUri(uri);
	}
	exports.deleteJiraLinkFromCase = deleteJiraLinkFromCase;
	function getEscalations(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/escalations?caseNumber=" + caseId);
	    return fetch_1.getUri(uri);
	}
	exports.getEscalations = getEscalations;
	function getLanguages() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/languages");
	    return fetch_1.getUri(uri);
	}
	exports.getLanguages = getLanguages;
	function getSeverities() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/severities");
	    return fetch_1.getUri(uri);
	}
	exports.getSeverities = getSeverities;
	function getStatuses() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/statuses");
	    return fetch_1.getUri(uri);
	}
	exports.getStatuses = getStatuses;
	function getTypes() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/types");
	    return fetch_1.getUri(uri);
	}
	exports.getTypes = getTypes;
	function getCaseExternalTrackers(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/externaltrackers");
	    return fetch_1.getUri(uri);
	}
	exports.getCaseExternalTrackers = getCaseExternalTrackers;
	function getCaseExternalTrackerUpdates(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/externaltrackerupdates");
	    return fetch_1.getUri(uri);
	}
	exports.getCaseExternalTrackerUpdates = getCaseExternalTrackerUpdates;
	function getCaseContacts(caseNumber, fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/contacts");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit !== undefined) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getCaseContacts = getCaseContacts;
	function addCaseContacts(caseNumber, contacts) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/contacts");
	    var apiContacts = (contacts || []).filter(function (c) { return c.ssoUsername; }).map(function (c) { return ({
	        ssoName: c.ssoUsername
	    }); });
	    var modifyContacts = {
	        contacts: apiContacts
	    };
	    return fetch_1.putUri(uri, modifyContacts);
	}
	exports.addCaseContacts = addCaseContacts;
	function deleteCaseContacts(caseNumber, contacts) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/contacts");
	    var apiContacts = (contacts || []).filter(function (c) { return c.ssoUsername; }).map(function (c) { return ({
	        ssoName: c.ssoUsername
	    }); });
	    var modifyContacts = {
	        contacts: apiContacts
	    };
	    return fetch_1.deleteUriWithBody(uri, modifyContacts);
	}
	exports.deleteCaseContacts = deleteCaseContacts;
	function getAccountCaseGroups(accountNumber, fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/groups/" + accountNumber);
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit !== undefined) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getAccountCaseGroups = getAccountCaseGroups;
	function getHistory(caseId, fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/history");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit !== undefined) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getHistory = getHistory;
	function getAssociates(caseId, fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/associates");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit !== undefined) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getAssociates = getAssociates;
	function addAssociate(caseId, associateUpdate) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/associate");
	    return fetch_1.putUri(uri, associateUpdate);
	}
	exports.addAssociate = addAssociate;
	function deleteAssociate(caseId, associateUpdate) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/associate");
	    return fetch_1.deleteUriWithBody(uri, associateUpdate);
	}
	exports.deleteAssociate = deleteAssociate;
	function updateOwner(caseId, ssoUsername) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/owner");
	    return fetch_1.putUri(uri, ssoUsername);
	}
	exports.updateOwner = updateOwner;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getCertification(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/cases/" + caseNumber + "/certification");
	    return fetch_1.getUri(uri);
	}
	exports.getCertification = getCertification;
	function updateCertification(certification) {
	    var caseNumber = certification.kase.caseNumber;
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/cases/" + caseNumber + "/certification");
	    return fetch_1.putUri(uri, certification);
	}
	exports.updateCertification = updateCertification;
	function createCertification(certification) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases");
	    return fetch_1.postUri(uri, certification);
	}
	exports.createCertification = createCertification;
	function getHardwareCertification(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/hardware/certcases/" + caseNumber);
	    return fetch_1.getUri(uri);
	}
	exports.getHardwareCertification = getHardwareCertification;
	function createHardwareCertification(certification) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/hardware/certcases/");
	    return fetch_1.getUri(uri);
	}
	exports.createHardwareCertification = createHardwareCertification;
	function updateHardwareCertification(caseNumber, certification) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/hardware/certcases/" + caseNumber);
	    return fetch_1.putUri(uri, certification);
	}
	exports.updateHardwareCertification = updateHardwareCertification;
	function getOpenStackCertification(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/certcases/" + caseNumber);
	    return fetch_1.getUri(uri);
	}
	exports.getOpenStackCertification = getOpenStackCertification;
	function createOpenStackCertification(certification) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/certcases/");
	    return fetch_1.postUri(uri, certification);
	}
	exports.createOpenStackCertification = createOpenStackCertification;
	function updateOpenStackCertification(caseNumber, certification) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/certcases/" + caseNumber);
	    return fetch_1.putUri(uri, certification);
	}
	exports.updateOpenStackCertification = updateOpenStackCertification;
	function getOpenStackApi(component) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/plugin/api");
	    if (component) {
	        uri.addQueryParam('component', component);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getOpenStackApi = getOpenStackApi;
	function getOpenStackFeature(component) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/plugin/feature");
	    if (component) {
	        uri.addQueryParam('pluginType', component);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getOpenStackFeature = getOpenStackFeature;
	function getOpenStackProtocol(component) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/plugin/protocol");
	    if (component) {
	        uri.addQueryParam('pluginType', component);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getOpenStackProtocol = getOpenStackProtocol;
	function getProgram(id) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/programs/" + id);
	    return fetch_1.getUri(uri);
	}
	exports.getProgram = getProgram;
	function getPrograms(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/programs");
	    if (filters && Object.keys(filters).length > 0) {
	        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
	            var key = _a[_i];
	            uri.addQueryParam(key, filters[key]);
	        }
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getPrograms = getPrograms;
	function getRedHatProduct(id) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/products/" + id);
	    return fetch_1.getUri(uri);
	}
	exports.getRedHatProduct = getRedHatProduct;
	function getRedHatProducts(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/products");
	    if (filters && Object.keys(filters).length > 0) {
	        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
	            var key = _a[_i];
	            uri.addQueryParam(key, filters[key]);
	        }
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getRedHatProducts = getRedHatProducts;
	function getRedHatVersion(id) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/versions/" + id);
	    return fetch_1.getUri(uri);
	}
	exports.getRedHatVersion = getRedHatVersion;
	function getRedHatVersions(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/versions");
	    if (filters && Object.keys(filters).length > 0) {
	        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
	            var key = _a[_i];
	            uri.addQueryParam(key, filters[key]);
	        }
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getRedHatVersions = getRedHatVersions;
	function getPlatform(id) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/platforms/" + id);
	    return fetch_1.getUri(uri);
	}
	exports.getPlatform = getPlatform;
	function getPlatforms(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/platforms");
	    if (filters && Object.keys(filters).length > 0) {
	        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
	            var key = _a[_i];
	            uri.addQueryParam(key, filters[key]);
	        }
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getPlatforms = getPlatforms;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getCertificationTestPlans(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplans");
	    return fetch_1.getUri(uri);
	}
	exports.getCertificationTestPlans = getCertificationTestPlans;
	function upsertCertificationTestPlans(caseNumber, testplans) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplans");
	    return fetch_1.putUri(uri, testplans);
	}
	exports.upsertCertificationTestPlans = upsertCertificationTestPlans;
	function getCertificationTestData(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testdata");
	    return fetch_1.getUri(uri);
	}
	exports.getCertificationTestData = getCertificationTestData;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getComments(caseNumber, fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit && limit > 0) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getComments = getComments;
	function upsertComment(comment, doNotSendEmail) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/comments");
	    if (doNotSendEmail === true) {
	        uri.addQueryParam('doNotSendEmail', true);
	    }
	    return fetch_1.putUri(uri, comment);
	}
	exports.upsertComment = upsertComment;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function articlesLinked(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/articles/linked");
	    return fetch_1.getUri(uri);
	}
	exports.articlesLinked = articlesLinked;
	function bomgarSessions(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/bomgarsessions");
	    return fetch_1.getUri(uri);
	}
	exports.bomgarSessions = bomgarSessions;
	function bugzillas(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/bugzillas");
	    return fetch_1.getUri(uri);
	}
	exports.bugzillas = bugzillas;
	function caseHistory(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/casehistory");
	    return fetch_1.getUri(uri);
	}
	exports.caseHistory = caseHistory;
	function chatTranscripts(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/chattranscripts");
	    return fetch_1.getUri(uri);
	}
	exports.chatTranscripts = chatTranscripts;
	function comments(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/comments");
	    return fetch_1.getUri(uri);
	}
	exports.comments = comments;
	function escalationsClosed(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/escalations/closed");
	    return fetch_1.getUri(uri);
	}
	exports.escalationsClosed = escalationsClosed;
	function escalationsOpen(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/escalations/open");
	    return fetch_1.getUri(uri);
	}
	exports.escalationsOpen = escalationsOpen;
	function fileAttachments(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/fileattachments");
	    return fetch_1.getUri(uri);
	}
	exports.fileAttachments = fileAttachments;
	function jiras(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/jiras");
	    return fetch_1.getUri(uri);
	}
	exports.jiras = jiras;
	function solutionsLinked(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/solutions/linked");
	    return fetch_1.getUri(uri);
	}
	exports.solutionsLinked = solutionsLinked;
	function teamMembers(caseId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count/teammembers");
	    return fetch_1.getUri(uri);
	}
	exports.teamMembers = teamMembers;
	function reviews(options) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/" + options.qualityIndexType + "/count");
	    if (options.userId) {
	        uri.addQueryParam('userId', options.userId);
	    }
	    if (options.createdFrom) {
	        uri.addQueryParam('createdFrom', options.createdFrom);
	    }
	    if (options.createdTo) {
	        uri.addQueryParam('createdTo', options.createdTo);
	    }
	    if (options.contentId) {
	        uri.addQueryParam('contentId', options.contentId);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.reviews = reviews;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getExternalTrackers(externalTrackerId, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/externaltrackers/{id}");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getExternalTrackers = getExternalTrackers;
	function getExternalTrackersUpdates(externalTrackerId, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/externaltrackerupdates/{id}");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getExternalTrackersUpdates = getExternalTrackersUpdates;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function health() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/health");
	    return fetch_1.getUri(uri);
	}
	exports.health = health;
	function hostname() {
	    return env_1.default.hydraHostName.toString();
	}
	exports.hostname = hostname;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAllGroupMetadatas() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/groups/");
	    return fetch_1.getUri(uri);
	}
	exports.getAllGroupMetadatas = getAllGroupMetadatas;
	function getGroupsForOwner(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/groups/filter");
	    return fetch_1.postUri(uri, filters);
	}
	exports.getGroupsForOwner = getGroupsForOwner;
	function postGroupDetails(groups) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/groups/");
	    return fetch_1.postUri(uri, groups);
	}
	exports.postGroupDetails = postGroupDetails;
	function updateGroupDetails(groups, groupId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/groups/" + groupId + "/");
	    return fetch_1.putUri(uri, groups);
	}
	exports.updateGroupDetails = updateGroupDetails;
	function deleteGroupByGroupId(groupId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/groups/" + groupId + "/");
	    return fetch_1.deleteUri(uri);
	}
	exports.deleteGroupByGroupId = deleteGroupByGroupId;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function runInsights(caseNumber, attachmentId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/attachments/" + attachmentId + "/insights");
	    return fetch_1.getUri(uri);
	}
	exports.runInsights = runInsights;
	function getInsightsRules(ruleIds) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/insights/rules");
	    return !!ruleIds ? fetch_1.postUri(uri, { ruleIds: ruleIds }) : fetch_1.getUri(uri);
	}
	exports.getInsightsRules = getInsightsRules;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function linkKcsResources(kcsLinkedResources) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/resource");
	    return fetch_1.postUri(uri, kcsLinkedResources);
	}
	exports.linkKcsResources = linkKcsResources;
	function getSolution(id) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/solutions/" + id);
	    return fetch_1.getUri(uri);
	}
	exports.getSolution = getSolution;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function runKyce(attachmentId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/hardgrok/attachments/" + attachmentId + "/inspect");
	    var headerParam = [];
	    headerParam.push({
	        key: 'Accept',
	        value: 'application/vnd.api.v1+json'
	    });
	    return fetch_1.getUri(uri, headerParam);
	}
	exports.runKyce = runKyce;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function createCommentFeedback(caseNumber, comment) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
	    return fetch_1.postUri(uri, comment);
	}
	exports.createCommentFeedback = createCommentFeedback;
	function updateCommentFeedback(caseNumber, comment) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
	    return fetch_1.putUri(uri, comment);
	}
	exports.updateCommentFeedback = updateCommentFeedback;
	function getCommentFeedback(caseNumber) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
	    return fetch_1.getUri(uri);
	}
	exports.getCommentFeedback = getCommentFeedback;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getProducts(sso) {
	    if (sso) {
	        var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/products/contact/" + sso);
	        return fetch_1.getUri(uri);
	    }
	    else {
	        var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/products");
	        return fetch_1.getUri(uri);
	    }
	}
	exports.getProducts = getProducts;
	function getProductVersions(productName) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/products/" + productName + "/versions");
	    return fetch_1.getUri(uri);
	}
	exports.getProductVersions = getProductVersions;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getQuestions(qualityIndexType) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/" + qualityIndexType + "/reviews/questions");
	    return fetch_1.getUri(uri);
	}
	exports.getQuestions = getQuestions;
	function getKtQuestions(qualityIndexType) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/" + qualityIndexType + "/reviews/ktquestions");
	    return fetch_1.getUri(uri);
	}
	exports.getKtQuestions = getKtQuestions;
	function getReviews(options) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/" + options.qualityIndexType + "/reviews");
	    if (options.createdBy) {
	        uri.addQueryParam('createdBy', options.createdBy);
	    }
	    if (options.createdFrom) {
	        uri.addQueryParam('createdFrom', options.createdFrom);
	    }
	    if (options.createdTo) {
	        uri.addQueryParam('createdTo', options.createdTo);
	    }
	    if (options.contentId) {
	        uri.addQueryParam('contentId', options.contentId);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getReviews = getReviews;
	function createReview(qualityIndexType, review) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/" + qualityIndexType + "/reviews");
	    return fetch_1.postUri(uri, review);
	}
	exports.createReview = createReview;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAllRoleMetadatas() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/roleMetadata/");
	    return fetch_1.getUri(uri);
	}
	exports.getAllRoleMetadatas = getAllRoleMetadatas;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getSbr(sbrId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/sbrs/" + sbrId);
	    return fetch_1.getUri(uri);
	}
	exports.getSbr = getSbr;
	function getSbrs() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/sbrs");
	    return fetch_1.getUri(uri);
	}
	exports.getSbrs = getSbrs;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAllShiftMetadatas() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shiftsMetadata/");
	    return fetch_1.getUri(uri);
	}
	exports.getAllShiftMetadatas = getAllShiftMetadatas;
	function createShiftMetadata(shiftMetadata) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shiftsMetadata/");
	    return fetch_1.postUri(uri, shiftMetadata);
	}
	exports.createShiftMetadata = createShiftMetadata;
	function updateShiftMetadata(shiftId, shiftMetadata) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shiftsMetadata/" + shiftId);
	    return fetch_1.putUri(uri, shiftMetadata);
	}
	exports.updateShiftMetadata = updateShiftMetadata;
	function deleteShiftMetadata(shiftId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shiftsMetadata/" + shiftId);
	    return fetch_1.deleteUri(uri);
	}
	exports.deleteShiftMetadata = deleteShiftMetadata;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getSolrAccess(solrQuery) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/solr/access")
	        .addQueryParam('q', solrQuery.q)
	        .addQueryParam('fl', '*, score') // this will add the score to each response
	        .addQueryParam('facet', 'true')
	        .addQueryParam('facet.field', 'accessState')
	        .addQueryParam('facet.field', 'hasPublishedRevision')
	        .addQueryParam('hl', 'true')
	        .addQueryParam('hl.simple.post', '%3C%2Fmark%3E')
	        .addQueryParam('hl.simple.pre', '%3Cmark%3E')
	        .addQueryParam('hl.fl', 'abstract')
	        .addQueryParam('enableElevation', 'true') // Enable hand picked solutions
	        .addQueryParam('wt', 'json');
	    // It's currently not completely clear if we need to explictly set the language facet.  Mani was unsure.
	    // .addQueryParam('fq', 'language:(en)')
	    if (solrQuery.fq != null) {
	        uri.addQueryParam('fq', solrQuery.fq);
	    }
	    if (solrQuery.sort != null) {
	        uri.addQueryParam('sort', solrQuery.sort);
	    }
	    if (solrQuery.start != null) {
	        uri.addQueryParam('start', solrQuery.start);
	    }
	    if (solrQuery.rows != null) {
	        uri.addQueryParam('rows', solrQuery.rows);
	    }
	    var headerParams = [{
	            key: 'Accept',
	            value: 'application/vnd.redhat.solr+json'
	        }];
	    return fetch_1.getUri(uri, headerParams);
	}
	exports.getSolrAccess = getSolrAccess;
	function getSolrCases(solrQuery) {
	    if (solrQuery.q == null || solrQuery.q === '')
	        throw 'SOLR Query is mandatory';
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/solr/case");
	    uri.addQueryParam('wt', 'json');
	    uri.addQueryParam('q', solrQuery.q);
	    if (solrQuery.fq != null && solrQuery.fq !== '') {
	        uri.addQueryParam('fq', solrQuery.fq);
	    }
	    if (solrQuery.start != null) {
	        uri.addQueryParam('start', solrQuery.start);
	    }
	    if (solrQuery.rows != null) {
	        uri.addQueryParam('rows', solrQuery.rows);
	    }
	    if (solrQuery.sort != null && solrQuery.sort !== '') {
	        uri.addQueryParam('sort', solrQuery.sort);
	    }
	    if (solrQuery.fl != null && solrQuery.fl !== '') {
	        uri.addQueryParam('fl', solrQuery.fl);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getSolrCases = getSolrCases;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getTags(fields, limit) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/tags");
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    if (limit) {
	        uri.addQueryParam('limit', limit);
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getTags = getTags;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAllTemplateMetadatas() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/templatesMetadata/");
	    return fetch_1.getUri(uri);
	}
	exports.getAllTemplateMetadatas = getAllTemplateMetadatas;
	function getTemplateMetadatasForUser(userId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/templatesMetadata/user/" + userId);
	    return fetch_1.getUri(uri);
	}
	exports.getTemplateMetadatasForUser = getTemplateMetadatasForUser;
	function postCustomTemplateForUser(template) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/templatesMetadata");
	    return fetch_1.postUri(uri, template);
	}
	exports.postCustomTemplateForUser = postCustomTemplateForUser;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getTestClasses(productType) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/testclasses?productType=" + productType + "&isSupport=true");
	    return fetch_1.getUri(uri);
	}
	exports.getTestClasses = getTestClasses;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getUsers(options) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users");
	    if (options) {
	        if (options.fields && options.fields.length > 0) {
	            uri.addQueryParam('fields', options.fields.join(','));
	        }
	        // By default the limit is 100 so if left undefined it will be 100
	        if (options.limit !== undefined) {
	            uri.addQueryParam('limit', options.limit);
	        }
	        Object.keys(options).filter(function (k) { return k !== 'fields' && k !== 'limit'; }).forEach(function (k) {
	            if (options[k] !== undefined) {
	                uri.addQueryParam(k, options[k]);
	            }
	        });
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getUsers = getUsers;
	function getUserBySSO(sso, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/sso/" + sso);
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getUserBySSO = getUserBySSO;
	function getUserById(id, fields) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + id);
	    if (fields && fields.length > 0) {
	        uri.addQueryParam('fields', fields.join(','));
	    }
	    return fetch_1.getUri(uri);
	}
	exports.getUserById = getUserById;
	function getCaseGroups(ssoUsername) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + ssoUsername + "/casegroups");
	    return fetch_1.getUri(uri);
	}
	exports.getCaseGroups = getCaseGroups;
	function updateUser(ssoUsername, user) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/sso/" + ssoUsername);
	    return fetch_1.patchUri(uri, user);
	}
	exports.updateUser = updateUser;
	function getRoles(userId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/roles");
	    return fetch_1.getUri(uri);
	}
	exports.getRoles = getRoles;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var fetch_1 = __webpack_require__(2);
	var env_1 = __webpack_require__(1);
	function getAllShiftsForUsers() {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/");
	    return fetch_1.getUri(uri);
	}
	exports.getAllShiftsForUsers = getAllShiftsForUsers;
	function getShiftsForUserFilters(filters) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/filter");
	    return fetch_1.postUri(uri, filters);
	}
	exports.getShiftsForUserFilters = getShiftsForUserFilters;
	function postShiftsForUsers(userShifts) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/bulk");
	    return fetch_1.postUri(uri, userShifts);
	}
	exports.postShiftsForUsers = postShiftsForUsers;
	function editShiftForUser(shiftRecordId, updatedShiftDetails) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/" + shiftRecordId);
	    return fetch_1.putUri(uri, updatedShiftDetails);
	}
	exports.editShiftForUser = editShiftForUser;
	function deleteShiftByShiftId(shiftId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/" + shiftId);
	    return fetch_1.deleteUri(uri);
	}
	exports.deleteShiftByShiftId = deleteShiftByShiftId;
	function deleteShiftForUsers(userShifts) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/shifts/remove");
	    return fetch_1.deleteUriWithBody(uri, userShifts);
	}
	exports.deleteShiftForUsers = deleteShiftForUsers;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var env_1 = __webpack_require__(1);
	var fetch_1 = __webpack_require__(2);
	function getVendorProduct(vendorProductPortalId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/" + vendorProductPortalId);
	    return fetch_1.getUri(uri);
	}
	exports.getVendorProduct = getVendorProduct;
	function getCertifications(vendorProductPortalId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/" + vendorProductPortalId + "/certifications");
	    return fetch_1.getUri(uri);
	}
	exports.getCertifications = getCertifications;
	function createVendorProduct(vendorProduct) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/");
	    return fetch_1.postUri(uri, vendorProduct);
	}
	exports.createVendorProduct = createVendorProduct;
	function updateVendorProduct(vendorProduct) {
	    var vendorProductPortalId = vendorProduct.portalId;
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/" + vendorProductPortalId);
	    return fetch_1.putUri(uri, vendorProduct);
	}
	exports.updateVendorProduct = updateVendorProduct;
	function getComponents(vendorProductPortalId) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/" + vendorProductPortalId + "/components");
	    return fetch_1.getUri(uri);
	}
	exports.getComponents = getComponents;
	function upsertComponents(vendorProductPortalId, components) {
	    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/vendorproducts/" + vendorProductPortalId + "/components");
	    return fetch_1.putUri(uri, components);
	}
	exports.upsertComponents = upsertComponents;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1])
	      }, this)
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }

	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = String(input)
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ })
/******/ ])
});
;