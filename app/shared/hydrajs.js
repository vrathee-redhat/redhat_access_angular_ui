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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
// Since we aren't transpiling to babel can't use ES6 imports here
var Uri = __webpack_require__(11);
var btoa = __webpack_require__(12);
function createBasicAuth(user, pass) {
    return "Basic " + btoa(user + ':' + pass);
}
exports.createBasicAuth = createBasicAuth;
var hydraHostName = new Uri('');
var pcmHostName = new Uri('');
var hydraFSHostName = new Uri('');
var pathPrefix = '/hydra/rest';
var fsPathPrefix = '/hydrafs/rest';
var auth = null;
// Add any new services consuming hydrajs to below arrays
var prodHostNames = ['access.redhat.com', 'prod.foo.redhat.com', 'fooprod.redhat.com', 'skedge.redhat.com'];
var qaHostNames = ['access.qa.redhat.com', 'qa.foo.redhat.com', 'fooqa.redhat.com', 'skedge.qa.redhat.com'];
var fteHostNames = ['access.devgssfte.devlab.phx1.redhat.com', 'fte.foo.redhat.com', 'foofte.redhat.com'];
var ciHostNames = ['access.devgssci.devlab.phx1.redhat.com', 'ci.foo.redhat.com', 'fooci.redhat.com', 'skedge.ci.redhat.com'];
var stageHostNames = ['access.stage.redhat.com', 'stage.foo.redhat.com', 'foostage.redhat.com', 'skedge.stage.redhat.com'];
if (process && Object({"NODE_ENV":"production"}) && Object({"NODE_ENV":"production"}).RHN_USER) {
    auth = createBasicAuth(Object({"NODE_ENV":"production"}).RHN_USER, Object({"NODE_ENV":"production"}).RHN_PASS);
}
if (process && Object({"NODE_ENV":"production"}) && (Object({"NODE_ENV":"production"}).HYDRA_HOSTNAME || Object({"NODE_ENV":"production"}).PCM_HOSTNAME)) {
    if (Object({"NODE_ENV":"production"}).HYDRA_HOSTNAME)
        hydraHostName = new Uri(Object({"NODE_ENV":"production"}).HYDRA_HOSTNAME);
    if (Object({"NODE_ENV":"production"}).PCM_HOSTNAME)
        pcmHostName = new Uri(Object({"NODE_ENV":"production"}).PCM_HOSTNAME);
    if (Object({"NODE_ENV":"production"}).HYDRA_FS_HOSTNAME)
        hydraFSHostName = new Uri(Object({"NODE_ENV":"production"}).HYDRA_FS_HOSTNAME);
}
else if (typeof window !== 'undefined' && window) {
    if (prodHostNames.indexOf(window.location.hostname) !== -1) {
        hydraHostName = new Uri('https://access.redhat.com/hydra/rest/');
        pcmHostName = hydraHostName;
        hydraFSHostName = new Uri('https://access.redhat.com/hydrafs/rest');
        fsPathPrefix = '/hydrafs/rest';
    }
    else if (qaHostNames.indexOf(window.location.hostname) !== -1) {
        hydraHostName = new Uri('https://access.qa.redhat.com/hydra/rest/');
        pcmHostName = hydraHostName;
        hydraFSHostName = new Uri('https://hydra.fs.dev.redhat.com/hydra/rest/');
        fsPathPrefix = pathPrefix;
    }
    else if (fteHostNames.indexOf(window.location.hostname) !== -1) {
        hydraHostName = new Uri('https://access.devgssfte.devlab.phx1.redhat.com/hydra/rest/');
        pcmHostName = hydraHostName;
    }
    else if (ciHostNames.indexOf(window.location.hostname) !== -1) {
        // There is no Hydra CI
        pcmHostName = new Uri('https://hydraadmin-corp-dev-redhat-com.vserver.devlab.ext.phx1.redhat.com/hydra/rest/');
    }
    else if (stageHostNames.indexOf(window.location.hostname) !== -1) {
        hydraHostName = new Uri('https://access.stage.redhat.com/hydra/rest/');
        pcmHostName = hydraHostName;
        hydraFSHostName = new Uri('https://hydra-fs.ext.paas.stage.redhat.com/hydra/rest/');
        fsPathPrefix = pathPrefix;
    }
}
else {
    throw new Error('Could not determine hostname, if you are running in Node make sure to set the HYDRA_HOSTNAME, PCM_HOSTNAME, RHN_USER, and RHN_PASS env variables.');
}
var Env = /** @class */ (function () {
    function Env() {
    }
    Env.hydraHostName = hydraHostName;
    Env.pcmHostName = pcmHostName;
    Env.hydraFSHostName = hydraFSHostName;
    Env.pathPrefix = pathPrefix;
    Env.fsPathPrefix = fsPathPrefix;
    Env.auth = auth;
    return Env;
}());
exports.default = Env;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Since we aren't transpiling to babel can't use ES6 imports here.  Also we can't specify the Response and Request
// types for fetch since A) They happen automatically with import which we can't use and B) the reference paths would
// be different in downstream apps
var env_1 = __webpack_require__(0);
function errorHandler(response) {
    return response.text().then(function (body) {
        if (body == null || body === '') {
            var error = new Error(body);
            Object.assign(error, { status: response.status }, { statusText: response.statusText });
            throw error;
        }
        var parsedError;
        try {
            parsedError = JSON.parse(body);
        }
        catch (e) { }
        if (parsedError) {
            var error = new Error((parsedError && parsedError.message) || body);
            Object.assign(error, parsedError, { isHydraError: true }, { status: response.status }, { statusText: response.statusText });
            throw error;
        }
        else {
            var error = new Error(body);
            Object.assign(error, { status: response.status }, { statusText: response.statusText });
            throw error;
        }
    });
}
function getIsTokenExpired() {
    if (window.sessionjs && window.sessionjs.isTokenExpired) {
        return window.sessionjs.isTokenExpired;
    }
    else {
        // For PCM we use the below line because in sessionjs we don't get the isTokenExpired() function directly
        // also it throws an error in PCM - window.sessionjs.isTokenExpired() is not a function
        if (window.sessionjs && window.sessionjs._state && window.sessionjs._state.keycloak) {
            return window.sessionjs._state.keycloak.isTokenExpired;
        }
    }
}
// If the token is expiring within 30 seconds, go ahead and refresh it.  Using 30 seconds considering jwt.js checks if
// the token needs to be refreshed every 58 seconds with a TTE of 90 seconds.  So 30 seconds guarantees that
// we are at the boundary of what jwt.js does without overlapping a great deal
function isTokenExpired() {
    var _isTokenExpired = getIsTokenExpired();
    return _isTokenExpired(30);
}
function forceTokenRefresh() {
    var _isTokenExpired = getIsTokenExpired();
    console.warn("Hydrajs detected the JWT token has expired, forcing an update");
    return new Promise(function (resolve, reject) {
        // updateToken(true) forces the token to update by passing -1 to keycloak.updateToken
        window.sessionjs.updateToken(true).then(function (refreshed) {
            if (refreshed) {
                resolve(true);
            }
            else if (!refreshed && !_isTokenExpired(0)) {
                resolve(true);
            }
            else if (!refreshed && _isTokenExpired(0)) {
                reject(new Error("Token not refreshed and is expired."));
            }
        }).catch(function (e) {
            reject(e);
        });
    });
}
function getToken() {
    if (window.sessionjs && window.sessionjs._state.keycloak.token) {
        if (window.sessionjs.isAuthenticated()) {
            return "Bearer " + window.sessionjs._state.keycloak.token;
        }
    }
    return null;
}
function responseHandler(response, dataType) {
    if (response.status === 204) {
        return null;
    }
    else if (response.status === 200 || response.status === 201) {
        return response.clone().text().then(function (body) {
            if (body == null || body === '')
                return null;
            if (dataType === 'text')
                return body;
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
function getSecondsElapsed(previousTime) {
    return (new Date().getTime() - previousTime) / 1000;
}
// Once Hydra goes to the Managed Platform then we may be able to remove this as the MP will have an 80s timeout for all requests.
function handleLongRunningRequest(uri, params, secondsElapsed) {
    if (secondsElapsed > 60) {
        // Raven
        if (typeof window.Raven !== 'undefined' && typeof window.Raven.captureException === 'function') {
            window.Raven.captureException(new Error("Hydra long running request, seconds taken: " + secondsElapsed), {
                extra: {
                    secondsElapsed: secondsElapsed,
                    url: uri.toString(),
                    params: params
                }
            });
        }
    }
}
function isError(error) {
    return error && error.message != null;
}
function processCaughtError(uri, params, error) {
    try {
        if (isError(error)) {
            error.extra = {
                url: uri.toString(),
                params: params
            };
        }
    }
    catch (e) { }
}
function callFetchAndHandleJwt(uri, params, dataType, externalUrl) {
    if (!externalUrl) {
        if (env_1.default.auth) {
            params.headers['Authorization'] = env_1.default.auth;
        }
        else if (getToken()) {
            params.headers['Authorization'] = getToken();
        }
        else {
            var error = new Error("Could not set JWT token on request header, unauthenticated.");
            Object.assign(error, { status: 401 }, { statusText: 'Unauthorized' });
            throw error;
        }
    }
    return new Promise(function (resolve, reject) {
        var start;
        if (!env_1.default.auth && isTokenExpired()) {
            forceTokenRefresh().then(function () {
                if (!externalUrl) {
                    params.headers['Authorization'] = getToken();
                }
                start = new Date().getTime();
                if (dataType) {
                    fetch(uri.toString(), params)
                        .then(function (response) { return responseHandler(response, dataType); })
                        .then(function (output) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        resolve(output);
                    })
                        .catch(function (error) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        processCaughtError(uri, params, error);
                        reject(error);
                    });
                }
                else {
                    fetch(uri.toString(), params)
                        .then(responseHandler)
                        .then(function (output) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        resolve(output);
                    })
                        .catch(function (error) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        processCaughtError(uri, params, error);
                        reject(error);
                    });
                }
            }).catch(function () {
                start = new Date().getTime();
                // Even if there was an error updating the token, we still need to hit Hydra, which at this point would probably return the "JWT expired" though this edge case is very unlikely.
                if (dataType) {
                    fetch(uri.toString(), params)
                        .then(function (response) { return responseHandler(response, dataType); })
                        .then(function (output) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        resolve(output);
                    })
                        .catch(function (error) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        processCaughtError(uri, params, error);
                        reject(error);
                    });
                }
                else {
                    fetch(uri.toString(), params)
                        .then(responseHandler)
                        .then(function (output) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        resolve(output);
                    })
                        .catch(function (error) {
                        handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                        processCaughtError(uri, params, error);
                        reject(error);
                    });
                }
            });
        }
        else {
            start = new Date().getTime();
            // Else we have a valid token and continue as always.
            if (dataType) {
                fetch(uri.toString(), params)
                    .then(function (response) { return responseHandler(response, dataType); })
                    .then(function (output) {
                    handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                    resolve(output);
                })
                    .catch(function (error) {
                    handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                    processCaughtError(uri, params, error);
                    reject(error);
                });
            }
            else {
                fetch(uri.toString(), params)
                    .then(responseHandler)
                    .then(function (output) {
                    handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                    resolve(output);
                })
                    .catch(function (error) {
                    handleLongRunningRequest(uri, params, getSecondsElapsed(start));
                    processCaughtError(uri, params, error);
                    reject(error);
                });
            }
        }
    });
}
function getUri(uri, headerParams, dataType, externalUrl) {
    var params = {
        method: 'GET',
        headers: {}
    };
    if (headerParams !== undefined) {
        headerParams.forEach(function (element) {
            params.headers[element.key] = element.value;
        });
    }
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    if (externalUrl)
        return callFetchAndHandleJwt(uri, params, undefined, externalUrl);
    return callFetchAndHandleJwt(uri, params);
}
exports.getUri = getUri;
function postUri(uri, body, dataType, externalUrl) {
    var params = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    if (externalUrl)
        return callFetchAndHandleJwt(uri, params, undefined, externalUrl);
    return callFetchAndHandleJwt(uri, params);
}
exports.postUri = postUri;
function postFormUri(uri, formData, dataType, externalUrl) {
    var params = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
        body: formData,
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    if (externalUrl)
        return callFetchAndHandleJwt(uri, params, undefined, externalUrl);
    return callFetchAndHandleJwt(uri, params);
}
exports.postFormUri = postFormUri;
function putUri(uri, body, dataType, externalUrl) {
    var params = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    if (externalUrl)
        return callFetchAndHandleJwt(uri, params, undefined, externalUrl);
    return callFetchAndHandleJwt(uri, params);
}
exports.putUri = putUri;
function patchUri(uri, body, dataType) {
    var params = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    return callFetchAndHandleJwt(uri, params);
}
exports.patchUri = patchUri;
function deleteUri(uri, dataType) {
    var params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    return callFetchAndHandleJwt(uri, params);
}
exports.deleteUri = deleteUri;
function deleteUriWithBody(uri, body, dataType) {
    var params = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    if (dataType)
        return callFetchAndHandleJwt(uri, params, dataType);
    return callFetchAndHandleJwt(uri, params);
}
exports.deleteUriWithBody = deleteUriWithBody;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getUserFields(options) {
    var finalFields = [];
    if (options && options.minimal === true) {
        var fields = [
            'id',
            'email',
            'fullName',
            'fullTitle',
            'inGSS',
            'isActive',
            'managerId',
            'mobilePhone',
            'outOfOffice',
            'phone',
            'rhatLocation',
            'region',
            'ssoUsername',
            'superRegion',
            'title',
            'isManager',
            'timeZone'
        ];
        Array.prototype.push.apply(finalFields, fields);
    }
    else {
        var fields = [
            'id',
            'accountId',
            'accountNumber',
            'callCenterId',
            'contactId',
            'contactNumber',
            'email',
            'firstName',
            'firstNameCustom',
            'fullName',
            'fullTitle',
            'gssCostcenterName',
            'genesysUsername',
            'ircNick',
            'itarUser',
            'inGSS',
            'isActive',
            'kerberosName',
            'lastName',
            'lastNameCustom',
            'managerId',
            'mobilePhone',
            'name',
            'officeLocation',
            'outOfOffice',
            'phone',
            'rhatLocation',
            'redhatComEmailAddress',
            'region',
            'ssoUsername',
            'superRegion',
            'title',
            'userName',
            'bomgarUsername',
            'canWorkNightShift',
            'isManager',
            'timeZone',
            'userRoleId'
        ];
        Array.prototype.push.apply(finalFields, fields);
    }
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'aboutMe',
            'alias',
            'city',
            'country',
            'countryCustom',
            'explicitKerberosName',
            // 'firstLevelManagerUsername',
            'fourthLevelManagerUsername',
            'managerSID',
            'outOfOfficeChangedBy',
            'outOfOfficeChangedOn',
            'secondLevelManagerUsername',
            'sixthLevelManagerUsername',
            'thirdLevelManagerUsername',
            'virtualOffice'
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    return finalFields;
}
exports.getUserFields = getUserFields;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getContactFields(options) {
    var finalFields = [];
    if (options && options.minimal === true) {
        var fields = [
            'id',
            'isOrgAdmin',
            'ssoUsername',
            'accountId',
            'email',
            'fullNameCustom',
            'isActive',
            'phone',
            'timezone',
            'regionGeo',
        ];
        Array.prototype.push.apply(finalFields, fields);
    }
    else {
        var fields = [
            'firstName',
            'lastName',
            'isOrgAdmin',
            'ssoUsername',
            'id',
            'accountId',
            'email',
            'fullNameCustom',
            'isActive',
            'phone',
            'timezone',
            'isInternal',
            'canAddAttachments',
            'contact24x7',
            'contactNumber',
            'defaultCaseGroup',
            'doNotCall',
            'firstNameCustom',
            'itarContact',
            'isEntitled',
            'lastNameCustom',
            'manageSupportCases',
            'mobilePhone',
            'name',
            'normalizedTZ',
            'preferredLanguage',
            'preferredMethodOfContact',
            'rhnLoginName',
            'regionGeo',
            'reportsToId',
            'srmContact',
            'secureSupportTech',
            'tamContact',
            'title',
        ];
        Array.prototype.push.apply(finalFields, fields);
    }
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'hasOptedOutOfEmail',
            'homePhone',
            'npsEligibility',
            'noLongerAtCompany',
            'otherPhone',
            'primaryComment',
            'primaryScore',
            'salutation',
            'surveyOptOut',
            'tamNewsletterSubscription',
            'typeOfContact',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    return finalFields;
}
exports.getContactFields = getContactFields;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getCaseGroupFields() {
    var fields = [
        'id',
        // accountId field not found
        // 'accountId',
        // 'accountDetails',
        // 'createdBy',
        'createdById',
        'createdDate',
        'folderNumber',
        // 'lastModifiedBy',
        'lastModifiedById',
        'lastModifiedDate',
        'name',
        'noAutomationForCases',
        // 'owner',
        'ownerId',
        'isPrivate'
    ];
    return fields;
}
exports.getCaseGroupFields = getCaseGroupFields;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getBugzillaBugFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'assignedTo',
        'blocks2',
        'blocks',
        'bugzillaURL',
        'bugzillaKeywords',
        'bugzillaLink',
        'bugzillaNumber',
        'caseNumber',
        'linkedAt',
        'component',
        'createdById',
        'createdDate',
        'dependsOn',
        'depends',
        'description',
        'dupeOf',
        'groups',
        'isOpen',
        'isPrivate',
        'lastModifiedById',
        'lastModifiedDate',
        'name',
        'platform',
        'priority',
        'product',
        'resolution',
        'severity',
        'status',
        'summary',
        'version',
    ];
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    return finalFields;
}
exports.getBugzillaBugFields = getBugzillaBugFields;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getAccountFields(options) {
    var finalFields = [];
    var fields = [
        'accountId',
        'accountNumber',
        'accountStatus',
        'businessHoursId',
        'cannotAddAttachments',
        'csm',
        'gscsmSegment',
        'caseCount',
        'escalationsInLast30Days',
        'description',
        'escalateToHomeGeoWith1stTouch',
        'escalateToHomeGeoWithoutFirstTouch',
        'expectsQuickInitialResponse',
        'hardwarePartner',
        'hasAvailableEnhancedSLA',
        'hasEnhancedSLA',
        'holdSupport',
        'identifyingAddressCountry',
        'identifyingAddressSuperRegion',
        'isPartner',
        'isActive',
        'name',
        'noAutomationForCases',
        'ownerId',
        'responseTime',
        'secureSupport',
        'securedEnvironment',
        'specialHandlingRequired',
        'strategic',
        'superRegion',
        'supportPartner',
        'tactical',
        'totalNumberOfEscalations',
        'watchlist',
        'hasSRM',
        'hasTAM',
        'isInternal',
        'informManagement'
    ];
    // owner: IUser;
    // csmUser: IUser;
    // parent: IAccount;
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'accountKey',
            'accountAlias',
            'additionalEnhancedEntitlementCount',
            'customerSegment',
            'csmUserId',
            'escalationsInLast60Days',
            'hasGroupACLs',
            'npsScore',
            'parentId',
            'requireCGroupOnCreate',
            'remainingEnhancedEntitlementCases',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeApiSpecificFields) {
        var apiFields = [
            'csmUserName',
            'csmUserSSOName',
            'escalationsInLast30DaysApi',
            'hasChat',
        ];
        Array.prototype.push.apply(finalFields, apiFields);
    }
    if (options && options.includeCsmUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "csmUser." + f; }));
    }
    return finalFields;
}
exports.getAccountFields = getAccountFields;
function getAccountNoteFields(options) {
    var finalFields = [];
    var fields = [
        'body',
        'numberOfDaysReviewPending',
        'reasonForReview',
        'isRetired',
        'subject',
        'type',
        'name',
        'lastModifiedDate',
        'createdDate'
    ];
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'accountId',
            'accountIdentifier',
            'isEditable',
            'expiryDate',
            'expirySetBy',
            'intendedReviewDate',
            'lastReviewDate',
            'needsReview',
            'needsReviewByAuthor',
            'noteAuthor',
            'retireDate',
            'retiredBy',
            'createdById',
            'lastModifiedById',
            'sortedType',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    return finalFields;
}
exports.getAccountNoteFields = getAccountNoteFields;
function getAccountMemberFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'createdById',
        'createdDate',
        'lastModifiedDate',
        'name',
        'role'
        // 'createdBy: IUser;
        // 'lastModifiedBy: IUser;
        // 'account: IAccount;
        // 'member: IUser;
    ];
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'ownerId',
            'isDeleted',
            'isAddToCaseTeam',
            'isEmailOnUpdates',
            'minimumSeverity',
            'isNotifyOfNewCases',
            'tamCaseStatus',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    if (options && options.includeMember) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "member." + f; }));
    }
    return finalFields;
}
exports.getAccountMemberFields = getAccountMemberFields;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getProductFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'productCode',
        'name',
        'productFamily',
        'productNumber',
        'currentlySupported'
    ];
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'ownerId',
            'isDeleted',
            'createdDate',
            'createdById',
            'lastModifiedDate',
            'lastModifiedById',
            'systemModstamp',
            'lastViewedDate',
            'lastReferencedDate',
            'connectionReceivedId',
            'connectionSentId',
            'endOfLifeDate',
            'supportedDate',
            'doesNotRequireSupportedEntitlement'
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeOwner) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "owner." + f; }));
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    return finalFields;
}
exports.getProductFields = getProductFields;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var insights_1 = __webpack_require__(9);
var roleMetadata_1 = __webpack_require__(13);
var testClass_1 = __webpack_require__(14);
var general_1 = __webpack_require__(15);
var kyce_1 = __webpack_require__(16);
var businessHours_1 = __webpack_require__(17);
var tags_1 = __webpack_require__(18);
var brms_1 = __webpack_require__(19);
var user_1 = __webpack_require__(2);
var contact_1 = __webpack_require__(3);
var case_1 = __webpack_require__(20);
var caseGroup_1 = __webpack_require__(4);
var bomgar_1 = __webpack_require__(23);
var caseHistory_1 = __webpack_require__(24);
var escalation_1 = __webpack_require__(25);
var chat_1 = __webpack_require__(26);
var bugzilla_1 = __webpack_require__(5);
var product_1 = __webpack_require__(7);
var externalTracker_1 = __webpack_require__(27);
var view_1 = __webpack_require__(28);
var account_1 = __webpack_require__(29);
var comment_1 = __webpack_require__(30);
var user_2 = __webpack_require__(31);
var kcs_1 = __webpack_require__(32);
var case_2 = __webpack_require__(33);
var attachment_1 = __webpack_require__(34);
var shiftMetadata_1 = __webpack_require__(35);
var templateMetadata_1 = __webpack_require__(36);
var vendorProduct_1 = __webpack_require__(37);
var certification_1 = __webpack_require__(38);
var hive_1 = __webpack_require__(39);
var certificationTest_1 = __webpack_require__(40);
var userShifts_1 = __webpack_require__(41);
var groupMetadata_1 = __webpack_require__(42);
var counts_1 = __webpack_require__(43);
var review_1 = __webpack_require__(44);
var products_1 = __webpack_require__(45);
var sbrs_1 = __webpack_require__(46);
var externalTrackers_1 = __webpack_require__(47);
var solr_1 = __webpack_require__(48);
var account_2 = __webpack_require__(49);
var callCenters_1 = __webpack_require__(50);
var commentFeedback_1 = __webpack_require__(51);
var roles_1 = __webpack_require__(52);
var vocabulary_1 = __webpack_require__(53);
var maintenance_1 = __webpack_require__(54);
var account_3 = __webpack_require__(6);
var comment_2 = __webpack_require__(55);
var metadata_1 = __webpack_require__(56);
var successPlan_1 = __webpack_require__(57);
var account_4 = __webpack_require__(58);
var cta_1 = __webpack_require__(59);
var timeline_1 = __webpack_require__(60);
var contact_2 = __webpack_require__(61);
exports.default = {
    general: {
        health: general_1.health,
        hostname: general_1.hostname
    },
    kase: {
        getComments: comment_1.getComments,
        upsertComment: comment_1.upsertComment,
        getCase: case_2.getCase,
        getCases: case_2.getCases,
        updateCase: case_2.updateCase,
        updateCaseByInternal: case_2.updateCaseByInternal,
        getLinkedJiras: case_2.getLinkedJiras,
        linkJiraToCase: case_2.linkJiraToCase,
        deleteJiraLinkFromCase: case_2.deleteJiraLinkFromCase,
        counts: {
            allCounts: counts_1.allCounts,
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
            reviews: counts_1.reviews,
            testPlan: counts_1.testPlan,
            testResult: counts_1.testResult,
        },
        attachments: {
            uploadAttachment: attachment_1.uploadAttachment,
            getAttachments: attachment_1.getAttachments,
        },
        getLanguages: case_2.getLanguages,
        getCaseSbrs: case_2.getCaseSbrs,
        getCaseTags: case_2.getCaseTags,
        updateCaseTags: case_2.updateCaseTags,
        deleteCaseTags: case_2.deleteCaseTags,
        getSeverities: case_2.getSeverities,
        getStatuses: case_2.getStatuses,
        getTypes: case_2.getTypes,
        getCaseExternalTrackers: case_2.getCaseExternalTrackers,
        getCaseExternalTrackerUpdates: case_2.getCaseExternalTrackerUpdates,
        getCaseContacts: case_2.getCaseContacts,
        addCaseContacts: case_2.addCaseContacts,
        deleteCaseContacts: case_2.deleteCaseContacts,
        getAccountCaseGroups: case_2.getAccountCaseGroups,
        getCaseHistory: case_2.getCaseHistory,
        getAssociates: case_2.getAssociates,
        addAssociate: case_2.addAssociate,
        deleteAssociate: case_2.deleteAssociate,
        updateOwner: case_2.updateOwner,
        getLockedCases: case_2.getLockedCases,
        lockCase: case_2.lockCase,
        unlockCase: case_2.unlockCase,
        getBomgarSessionKey: case_2.getBomgarSessionKey,
        getNep: case_2.getNep,
        createNep: case_2.createNep,
        updateNep: case_2.updateNep,
        deleteNep: case_2.deleteNep,
        getAttachments: case_2.getAttachments,
        updateAttachment: case_2.updateAttachment,
        getBomgarSessions: case_2.getBomgarSessions,
        updateCaseSbrs: case_2.updateCaseSbrs,
        deleteCaseSbrs: case_2.deleteCaseSbrs,
        getMilestones: case_2.getMilestones,
        getChatTranscripts: case_2.getChatTranscripts,
        getBugs: case_2.getBugs,
        getCasesFromSoql: case_2.getCasesFromSoql
    },
    insights: {
        runInsights: insights_1.runInsights,
        getInsightsRules: insights_1.getInsightsRules,
    },
    brms: {
        getBrmsResponse: brms_1.getBrmsResponse
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
        createHardwareCertification: certification_1.createHardwareCertification,
        updateHardwareCertification: certification_1.updateHardwareCertification,
        getCaseNumberFromPortalId: certification_1.getCaseNumberFromPortalId,
        getHardwareCertification: certification_1.getHardwareCertification,
        createOpenStackCertification: certification_1.createOpenStackCertification,
        updateOpenStackCertification: certification_1.updateOpenStackCertification,
        getOpenStackCertification: certification_1.getOpenStackCertification,
        getOpenStackApi: certification_1.getOpenStackApi,
        getOpenStackFeature: certification_1.getOpenStackFeature,
        getOpenStackProtocol: certification_1.getOpenStackProtocol,
        getOpenStackVendorProduct: vendorProduct_1.getOpenStackVendorProduct,
        updateOpenStackVendorProduct: vendorProduct_1.updateOpenStackVendorProduct,
        getTestClasses: testClass_1.getTestClasses,
        getOpenStackVendorProductComponents: vendorProduct_1.getOpenStackVendorProductComponents,
        getCertificationTestPlan: certificationTest_1.getCertificationTestPlan,
        updateCertificationTestPlanComponent: certificationTest_1.updateCertificationTestPlanComponent,
        updateCertificationTestPlanItem: certificationTest_1.updateCertificationTestPlanItem,
        updateCertificationExceptionReason: certificationTest_1.updateCertificationExceptionReason,
        getCertificationTestResults: certificationTest_1.getCertificationTestResults,
        getCertificationTestLog: certificationTest_1.getCertificationTestLog,
        getCertificationSubTestLog: certificationTest_1.getCertificationSubTestLog,
        updateResultReview: certificationTest_1.updateResultReview,
        updateSubTestStatus: certificationTest_1.updateSubTestStatus,
    },
    hive: {
        getAll: hive_1.getAll,
        getProgram: hive_1.getProgram,
        getPrograms: hive_1.getPrograms,
        getRedHatProduct: hive_1.getRedHatProduct,
        getRedHatProducts: hive_1.getRedHatProducts,
        getRedHatVersion: hive_1.getRedHatVersion,
        getRedHatVersions: hive_1.getRedHatVersions,
        getPlatform: hive_1.getPlatform,
        getPlatforms: hive_1.getPlatforms,
    },
    review: {
        getQuestions: review_1.getQuestions,
        getKtQuestions: review_1.getKtQuestions,
        getReviews: review_1.getReviews,
        createReview: review_1.createReview
    },
    users: {
        getUsers: user_2.getUsers,
        getUserById: user_2.getUserById,
        getUserBySSO: user_2.getUserBySSO,
        getCaseGroups: user_2.getCaseGroups,
        getRoles: user_2.getRoles,
        updateUser: user_2.updateUser,
        getChatterComments: comment_1.getChatterComments,
        getNnoRegions: user_2.getNnoRegions,
        updateUserInformation: user_2.updateUserInformation,
        getAllRoleTemplates: user_2.getAllRoleTemplates,
        getUserSbrs: user_2.getUserSbrs,
        getUserTags: user_2.getUserTags,
        getUserQueueBuddies: user_2.getUserQueueBuddies,
        getAllRoles: user_2.getAllRoles,
        getLanguage: user_2.getLanguage,
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
        getSolution: kcs_1.getSolution,
        getResources: kcs_1.getResources
    },
    products: {
        getProducts: products_1.getProducts,
        getProductVersions: products_1.getProductVersions
    },
    sbrs: {
        getSbr: sbrs_1.getSbr,
        getSbrs: sbrs_1.getSbrs,
        getSbrTags: sbrs_1.getSbrTags
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
        getAccount: account_2.getAccount,
        getAccountContacts: account_2.getAccountContacts,
        getAccountNotes: account_2.getAccountNotes,
        getAccountTeamMembers: account_2.getAccountTeamMembers,
        patchAccounts: account_2.patchAccounts,
        getContactDetailBySso: account_2.getContactDetailBySso
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
    },
    fields: {
        getCaseFields: case_1.getCaseFields,
        getUserFields: user_1.getUserFields,
        getContactFields: contact_1.getContactFields,
        getCaseGroupFields: caseGroup_1.getCaseGroupFields,
        getCaseBomgarSessionFields: bomgar_1.getCaseBomgarSessionFields,
        getAccountFields: account_3.getAccountFields,
        getAccountNoteFields: account_3.getAccountNoteFields,
        getAccountMemberFields: account_3.getAccountMemberFields,
        getCaseCommentFields: comment_2.getCaseCommentFields,
        getLiveChatTranscriptFields: chat_1.getLiveChatTranscriptFields,
        getBugzillaBugFields: bugzilla_1.getBugzillaBugFields,
        getProductFields: product_1.getProductFields,
        getExternalTrackerFields: externalTracker_1.getExternalTrackerFields
    },
    caseHistory: {
        getHistory: caseHistory_1.getHistory
    },
    escalations: {
        getEscalations: escalation_1.getEscalations,
        createIceEscalation: escalation_1.createIceEscalation
    },
    userManagement: {
        createRole: roles_1.createRole,
        updateRole: roles_1.updateRole,
        deleteRole: roles_1.deleteRole
    },
    vocabulary: {
        getVocabularyCategory: vocabulary_1.getVocabularyCategory,
        getVocabularyComponents: vocabulary_1.getVocabularyComponents,
        getVocabularyProducts: vocabulary_1.getVocabularyProducts,
        getVocabularySbrs: vocabulary_1.getVocabularySbrs,
        getVocabularyTags: vocabulary_1.getVocabularyTags
    },
    maintenance: {
        getMaintenanceMode: maintenance_1.getMaintenanceMode
    },
    dashboard: {
        getViews: view_1.getViews,
        getLabs: view_1.getLabs,
        getAccountDetails: view_1.getAccountDetails,
        getAllCaseInfo: view_1.getAllCaseInfo,
        getErrata: view_1.getErrata,
        getSubscriptionStats: view_1.getSubscriptionStats,
        getInsights: view_1.getInsights,
        getAccounts: account_1.getAccounts,
    },
    csp: {
        metadata: {
            getMetadata: metadata_1.getMetadata
        },
        account: {
            getCSAccounts: account_4.getCSAccounts,
            getOpenCaseCount: account_4.getOpenCaseCount,
            getCTACount: account_4.getCTACount,
            getEntitlementCount: account_4.getEntitlementCount,
        },
        contact: {
            getContacts: contact_2.getContacts
        },
        cta: {
            listCtas: cta_1.listCtas,
            getCtaGroupedCount: cta_1.getCtaGroupedCount,
            getCta: cta_1.getCta,
            updateCta: cta_1.updateCta,
            updateCtaTask: cta_1.updateCtaTask,
            addCta: cta_1.addCta,
            addTask: cta_1.addTask,
            deleteCta: cta_1.deleteCta,
            deleteTask: cta_1.deleteTask,
            getCtaTasks: cta_1.getCtaTasks,
            getCtaComments: cta_1.getCtaComments,
            getCtaComment: cta_1.getCtaComment,
            updateCtaComment: cta_1.updateCtaComment,
            deleteCtaComment: cta_1.deleteCtaComment,
            addCtaComment: cta_1.addCtaComment
        },
        successPlan: {
            getSuccessPlansForUserName: successPlan_1.getSuccessPlansForUserName,
            getSuccessPlansForAccountNumber: successPlan_1.getSuccessPlansForAccountNumber,
            getSuccessPlansForId: successPlan_1.getSuccessPlansForId,
            updateSuccessPlan: successPlan_1.updateSuccessPlan,
            addSuccessPlan: successPlan_1.addSuccessPlan,
            removeSuccessPlan: successPlan_1.removeSuccessPlan,
            addProduct: successPlan_1.addProduct,
            updateProduct: successPlan_1.updateProduct,
            removeProduct: successPlan_1.removeProduct,
            addObjective: successPlan_1.addObjective,
            updateObjective: successPlan_1.updateObjective,
            removeObjective: successPlan_1.removeObjective,
            addObjectiveLink: successPlan_1.addObjectiveLink,
            updateObjectiveLink: successPlan_1.updateObjectiveLink,
            removeObjectiveLink: successPlan_1.removeObjectiveLink,
            addObjectiveStakeholder: successPlan_1.addObjectiveStakeholder,
            updateObjectiveStakeholder: successPlan_1.updateObjectiveStakeholder,
            removeObjectiveStakeholder: successPlan_1.removeObjectiveStakeholder
        },
        timeline: {
            getTimeline: timeline_1.getTimeline,
            getTimelineActivity: timeline_1.getTimelineActivity,
            updateTimelineActivity: timeline_1.updateTimelineActivity,
            addTimelineActivity: timeline_1.addTimelineActivity,
            deleteTimelineActivity: timeline_1.deleteTimelineActivity
        }
    }
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
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
/* 10 */
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
/* 11 */
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
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Uri;
  } else {
    global.Uri = Uri;
  }
}(this));


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function _btoa(str) {
  return btoa(str)
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getAllRoleMetadatas() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/skedge/roleMetadata/");
    return fetch_1.getUri(uri);
}
exports.getAllRoleMetadatas = getAllRoleMetadatas;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getTestClasses(productType, pluginType) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/testclasses");
    uri.addQueryParam('isSupport', true);
    uri.addQueryParam('productType', productType);
    if (pluginType) {
        uri.addQueryParam('pluginType', pluginType);
    }
    return fetch_1.getUri(uri);
}
exports.getTestClasses = getTestClasses;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getBusinessHours(timezone) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/businesshours");
    uri.addQueryParam('timezone', timezone);
    return fetch_1.getUri(uri);
}
exports.getBusinessHours = getBusinessHours;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getBrmsResponse(brmsPayload) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/brms/");
    return fetch_1.postUri(uri, brmsPayload, 'text');
}
exports.getBrmsResponse = getBrmsResponse;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
var contact_1 = __webpack_require__(3);
var caseGroup_1 = __webpack_require__(4);
var bugzilla_1 = __webpack_require__(5);
var account_1 = __webpack_require__(6);
var entitlement_1 = __webpack_require__(21);
var product_1 = __webpack_require__(7);
var recordType_1 = __webpack_require__(22);
function getCaseFields(options) {
    var finalFields = [];
    var caseFields = [
        'accountBugzillaConfidentialGroup',
        'accountId',
        'accountNumber',
        'actionPlan',
        'actionPlanLastUpdated',
        'actionPlanLastUpdatedByUserId',
        'alternateId',
        'amcFinalRemedyProvided',
        'amcTemporaryRemedyProvided',
        'automationEnabledForCaseComputed',
        'bugId',
        'bugzillaLink',
        'bugzillaNumber',
        'bugzillaSummary',
        'businessHoursId',
        'caseContact',
        'caseCreatedDayOfWeek',
        'caseCreatedHourOfDay',
        'caseGroupId',
        'caseLanguage',
        'caseLink',
        'caseNumber',
        'caseOwnerId',
        'caseSummary',
        'caseType',
        'certArchitecture',
        'certCategory',
        'certPortalId',
        'certProduct',
        'certVendorName',
        'certVendorPortalId',
        'certVendorProductName',
        'certVendorProductPortalId',
        'certVersion',
        'certProgram',
        'closedDate',
        'commentCount',
        'contactId',
        'contactInfo24x7',
        'contributors',
        'createdByContactId',
        'createdByUserId',
        'createdByName',
        'createdDate',
        'critSit',
        'currentCaseOwnerManagersEmail',
        'customerCaseNotes',
        'customerEngagementScorecard',
        'customerEscalation',
        'customerSegment',
        'description',
        'emailAddress',
        'enhancedSLA',
        'entitlementId',
        'entitlementNeedsAttention',
        'entitlementState',
        'environment',
        'externalHandlingSystem',
        'externalLock',
        'externalLockById',
        'externalLockDate',
        'fts',
        'ftsHandoverReady',
        'ftsRole',
        'hasCommentsUnreadByOwner',
        'hasNewPublicComment',
        'hasSelfServiceComments',
        'hostname',
        'hotfixDelivered',
        'hotfixDeliveredDate',
        'hotfixRequestDate',
        'hotfixRequested',
        'hoursSinceLastPublicComment',
        'id',
        'identifyingAddressCountry',
        'initialServiceLevel',
        'internalStatus',
        'isABRTCaseThatShouldRemainClosed',
        'isClosed',
        'isDeleted',
        'isEscalated',
        'isPOC',
        'isReviewed',
        'isStopped',
        'issue',
        'itar',
        'kickCase',
        'lastBreach',
        'lastClosedAt',
        'lastEscalationUpdatedAt',
        'lastModifiedByContactId',
        'lastModifiedById',
        'lastModifiedByLink',
        'lastModifiedByName',
        'lastModifiedByUserId',
        'lastModifiedDate',
        'legacyId',
        'legacySystem',
        'linkToCaseInPortal',
        'linkedResourceCount',
        'linkedToRecommendationOnClosure',
        'linkedToRecommendationOnClosureSet',
        'milestoneStatus',
        'name',
        'needsNewOwner',
        'noAutomationForCase',
        'normalizedServiceLevel',
        'numberOfBreaches',
        'origin',
        'ownerIRCNickname',
        'ownerId',
        'ownersManagersEmail',
        'ownerOutOfOffice',
        'priorityScore',
        'isPrivate',
        'proactive',
        'privateCommentCount',
        'product',
        'productFamily',
        'publicComment',
        'publicCommentCount',
        'publicTSEComments',
        'reliefAt',
        'remoteSessionCount',
        'requestManagementEscalation',
        'resolution',
        'resolutionDescription',
        'resolvedAt',
        'sbrGroup',
        'sbt',
        'sbtState',
        'searchHelper',
        'sendCSATSurvey',
        'severity',
        'slaExitDate',
        'slaStartDate',
        'srmFlag',
        'status',
        'strategic',
        'subject',
        'summaryLastModifiedByUserId',
        'summaryLastUpdated',
        'tags',
        'tamCase',
        'targetDate',
        'translators',
        'ttc',
        'version',
        'waitingOnCallback'
    ];
    Array.prototype.push.apply(finalFields, caseFields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'accountNumberRef',
            'assetId',
            'caseOwnerIsTam',
            'caseOwnerManagersEmail',
            'caseOwnerSuperRegion',
            'createdById',
            'createdByLink',
            'createdDateGainsight',
            'closedDateGainsight',
            'company',
            'connectionReceivedId',
            'connectionSentId',
            'contactLink',
            'contactPreferredLanguage',
            'firstCaseInactivityWarningSentAt',
            'highestSeverity',
            'hoursInCurrentStatus',
            'hoursSinceCaseLastUpdated',
            'hoursSinceLastCommentOfAnyType',
            'hoursSinceLastPrivateComment',
            'hxComment',
            'hxDirection',
            'hxHubId',
            'hxId',
            'hxIsEscalation',
            'hxPartnerId',
            'hxStatus',
            'lastETUUpdatedAt',
            'lastEscalationAssociatedAt',
            'lastPrivateCommentDateTime',
            'lastPublicAttachmentMs',
            'lastPublicCaseUpdateContactId',
            'lastPublicCaseUpdateMs',
            'lastPublicCaseUpdateUserId',
            'lastPublicCommentDateTime',
            'lastPublicCommentPublishedMs',
            'lastPublicUpdateBy',
            'lastPublicUpdateDateDisplay',
            'lastReferencedDate',
            'lastStatusChange',
            'lastUpdateDate',
            'lastViewedDate',
            'ltrocClosed',
            'ltrocClosedSet',
            'manuallySetNoCSATSurvey',
            'newTimestamp',
            'originalDescription',
            'originalEnvironment',
            'originalIssue',
            'originalPeriodicityOfIssue',
            'originalProduct',
            'originalServiceLevel',
            'originalSeverity',
            'originalSubject',
            'originalTimeFramesAndUrgency',
            'originalVersion',
            // 'parent',
            'parentId',
            'periodicityOfIssue',
            'prsRecordId',
            'pushToPartner',
            'priorityScoreExplanation',
            'priorityScoreFormula',
            'phone',
            'priorityScoreLastUpdateDate',
            'reason',
            'redHatLogin',
            'recordType',
            'recordTypeId',
            'redHatLoginRef',
            'refTagForEmails',
            'relatedChanges',
            'reopenCount',
            'resetSBTCount',
            'rhProductId',
            'rhVersionId',
            'secondCaseInactivityWarningSentAt',
            'stopStartDate',
            'systemModstamp',
            'timeFramesAndUrgency',
            'timeSinceCaseWasLastUpdated',
            'totalDaysWoCollaboration',
            'totalEscalation',
            'userAgent',
            'vhtScore',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeCreatedByContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "createdByContact." + f; }));
    }
    if (options && options.includeCreatedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdByUser." + f; }));
    }
    if (options && options.includeActionPlanLastUpdatedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "actionPlanLastUpdatedByUser." + f; }));
    }
    if (options && options.includeExternalLockBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "externalLockBy." + f; }));
    }
    if (options && options.includeAccount) {
        Array.prototype.push.apply(finalFields, account_1.getAccountFields(options).map(function (f) { return "account." + f; }));
    }
    if (options && options.includeRecordType) {
        Array.prototype.push.apply(finalFields, recordType_1.getRecordTypeFields(options).map(function (f) { return "recordType." + f; }));
    }
    // Currently not used
    if (options && options.includeBug) {
        Array.prototype.push.apply(finalFields, bugzilla_1.getBugzillaBugFields().map(function (f) { return "bug." + f; }));
    }
    if (options && options.includeCaseGroup) {
        Array.prototype.push.apply(finalFields, caseGroup_1.getCaseGroupFields().map(function (f) { return " caseGroup." + f; }));
    }
    if (options && options.includeCaseOwner) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "caseOwner." + f; }));
    }
    if (options && options.includeContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "contact." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    if (options && options.includeLastModifiedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedByUser." + f; }));
    }
    if (options && options.includeLastPublicCaseUpdateUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastPublicCaseUpdateUser." + f; }));
    }
    if (options && options.includeLastPublicCaseUpdateContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "lastPublicCaseUpdateContact." + f; }));
    }
    if (options && options.includeLastModifiedByContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "lastModifiedByContact." + f; }));
    }
    if (options && options.includeSummaryLastModifiedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "summaryLastModifiedByUser." + f; }));
    }
    if (options && options.includeEntitlement) {
        Array.prototype.push.apply(finalFields, entitlement_1.getEntitlementFields(options).map(function (f) { return "entitlement." + f; }));
    }
    if (options && options.includeProduct) {
        Array.prototype.push.apply(finalFields, product_1.getProductFields(options).map(function (f) { return "rhProduct." + f; }));
    }
    return finalFields;
}
exports.getCaseFields = getCaseFields;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getEntitlementFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'name',
        'status',
        'serviceLevel',
        'serviceType',
        'supportLevel'
    ];
    // 'createdBy: IUser;
    // 'lastModifiedBy: IUser;
    // 'account: IAccount;
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'createdById',
            'createdDate',
            'lastModifiedById',
            'lastModifiedDate',
            'isDeleted',
            'accountId',
            'assetId',
            'isAssociatedWithNoEngineeringProducts',
            'businessHoursId',
            'businessUnit',
            'casesPerEntitlement',
            'isConsiderSupported',
            'contractLineItemId',
            'contractLineItemSubscriptionProductNum',
            'endDate',
            'entitlementProcessRule',
            'externalAccountNumber',
            'externalContractId',
            'externalContractLineItemId',
            'externalEntitlementId',
            'externalProductCode',
            'installBaseNumber',
            'isPerIncident',
            'isActive',
            'isL3',
            'isLayered',
            'isManuallySelectedEntitlementProcess',
            'isTAMEntitlement',
            'lastReferencedDate',
            'lastViewedDate',
            'levelTypeConcat',
            'oracleStatus',
            'quantity',
            'remainingCases',
            'serviceContractId',
            'serviceLevelLabel',
            'serviceValue',
            'slaProcessId',
            'startDate',
            'statusAndStartDate',
            'subscriptionNumber',
            'subscriptionProductNumber',
            'type',
            'coordinates'
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    return finalFields;
}
exports.getEntitlementFields = getEntitlementFields;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getRecordTypeFields(options) {
    var finalFields = [];
    var fields = [
        'name',
    ];
    Array.prototype.push.apply(finalFields, fields);
    return finalFields;
}
exports.getRecordTypeFields = getRecordTypeFields;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getCaseBomgarSessionFields(options) {
    var finalFields = [];
    var caseBomgarSessionFields = [
        'id',
        'createdById',
        'createdDate',
        'lastModifiedById',
        'lastModifiedDate',
        'name',
        'duration',
        'primaryCustomerName',
        'primarySupportRepName',
        'salesforceRecordId',
        'sessionRecordingUrl',
        'sessionStartDate',
        'sessionEndDate'
    ];
    Array.prototype.push.apply(finalFields, caseBomgarSessionFields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'ownerId',
            'isDeleted',
            'chatDownloadUrl',
            'chatViewUrl',
            'externalKey',
            'fileTransferCount',
            'hostname',
            'os',
            'privateIp',
            'publicSiteId',
            'publicIp',
            'recordingDownloadUrl',
            'recordingViewUrl',
            'relatedCase',
            'durationHours',
            'sessionRecording',
            'lastActivityDate',
            'lastReferencedDate',
            'lastViewedDate'
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    return finalFields;
}
exports.getCaseBomgarSessionFields = getCaseBomgarSessionFields;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getHistory(options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/history");
    if (options) {
        if (options.fields && options.fields.length > 0) {
            uri.addQueryParam('fields', options.fields.join(','));
        }
        Object.keys(options).filter(function (k) { return k !== 'fields'; }).forEach(function (k) {
            if (options[k] !== undefined) {
                uri.addQueryParam(k, options[k]);
            }
        });
    }
    return fetch_1.getUri(uri);
}
exports.getHistory = getHistory;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getEscalations(options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/escalations");
    if (options.caseNumber) {
        uri.addQueryParam('caseNumber', options.caseNumber);
    }
    if (options.accountNumber) {
        uri.addQueryParam('accountNumber', options.accountNumber);
    }
    return fetch_1.getUri(uri);
}
exports.getEscalations = getEscalations;
function createIceEscalation(escalation) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/escalations");
    return fetch_1.postUri(uri, escalation);
}
exports.createIceEscalation = createIceEscalation;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getLiveChatTranscriptFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'createdDate',
        'chatDuration',
        'lastModifiedDate',
        'body',
        'status',
    ];
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'isDeleted',
            'accountId',
            'accountIdFormula',
            'averageResponseTimeOperator',
            'averageResponseTimeVisitor',
            'browser',
            'browserLanguage',
            'caseId',
            'createdById',
            'lastModifiedById',
            'caseNumber',
            'contactId',
            'contactIdFormula',
            'endTime',
            'endedBy',
            'ipAddress',
            'lastReferencedDate',
            'lastViewedDate',
            'leadId',
            'liveChatButtonId',
            'liveChatDeploymentId',
            'liveChatVisitorId',
            'location',
            'operatorMessageCount',
            'ownerId',
            'platform',
            'referrerUri',
            'requestTime',
            'ssoUsername',
            'screenResolution',
            'skillId',
            'startTime',
            'timeToAnswer',
            'userAgent',
            'visitorMessageCount',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    if (options && options.includeAccount) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "account." + f; }));
    }
    return finalFields;
}
exports.getLiveChatTranscriptFields = getLiveChatTranscriptFields;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
function getExternalTrackerFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'createdDate',
        'description',
        'hasBeenPushedSuccessfully',
        'hasBeenPushed',
        'lastModifiedDate',
        'rejected',
        'resourceKey',
        'resourceURL',
        'status',
        'system',
        'ticketReference',
        'title',
    ];
    // 'collaborationComment: ICaseComment;
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'closedAt',
            'collaborationCommentId',
            'caseId',
            'createdAt',
            'createdById',
            'deletedAt',
            'deletedByName',
            'establishedBy',
            'eligibilityKeyValue',
            'identifier',
            'lastModifiedById',
            'lastActivityDate',
            'lastReferencedDate',
            'lastViewedDate',
            'lastPushRequest',
            'liveID',
            'name',
            'overrideEntitlementCheck',
            'productID',
            'productName',
            'rejectedAt',
            'rejectedMessage',
            'severity',
            'solveCallingCountry',
            'supportTopicID',
            'supportTopicName',
            'systemInstance',
            'visibilityLevel'
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeCreatedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedBy) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    return finalFields;
}
exports.getExternalTrackerFields = getExternalTrackerFields;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getViews(id, startDate, endDate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/views");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    if (paramValid(startDate)) {
        uri.addQueryParam('startDate', startDate);
    }
    if (paramValid(endDate)) {
        uri.addQueryParam('endDate', endDate);
    }
    return fetch_1.getUri(uri);
}
exports.getViews = getViews;
function getLabs(id, startDate, endDate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/labs");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    if (paramValid(startDate)) {
        uri.addQueryParam('startDate', startDate);
    }
    if (paramValid(endDate)) {
        uri.addQueryParam('endDate', endDate);
    }
    return fetch_1.getUri(uri);
}
exports.getLabs = getLabs;
function getAccountDetails(id) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/account/details");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    return fetch_1.getUri(uri);
}
exports.getAccountDetails = getAccountDetails;
function getAllCaseInfo(id, startDate, endDate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/cases");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    if (paramValid(startDate)) {
        uri.addQueryParam('startDate', startDate);
    }
    if (paramValid(endDate)) {
        uri.addQueryParam('endDate', endDate);
    }
    return fetch_1.getUri(uri);
}
exports.getAllCaseInfo = getAllCaseInfo;
function getErrata(id, startDate, endDate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/errata");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    if (paramValid(startDate)) {
        uri.addQueryParam('startDate', startDate);
    }
    if (paramValid(endDate)) {
        uri.addQueryParam('endDate', endDate);
    }
    return fetch_1.getUri(uri);
}
exports.getErrata = getErrata;
function getInsights(id, startDate, endDate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/insights");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    if (paramValid(startDate)) {
        uri.addQueryParam('startDate', startDate);
    }
    if (paramValid(endDate)) {
        uri.addQueryParam('endDate', endDate);
    }
    return fetch_1.getUri(uri);
}
exports.getInsights = getInsights;
function getSubscriptionStats(id) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/subscriptions");
    if (paramValid(id)) {
        uri.addQueryParam('id', id);
    }
    return fetch_1.getUri(uri);
}
exports.getSubscriptionStats = getSubscriptionStats;
function paramValid(param) {
    return !(param.length === 0 && param === '');
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getAccounts() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/dashboard/v2/accounts");
    return fetch_1.getUri(uri);
}
exports.getAccounts = getAccounts;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getComments(caseNumber, options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments");
    if (options && options.limit && options.limit > 0) {
        uri.addQueryParam('limit', options.limit);
    }
    if (options && options.orderDirection) {
        uri.addQueryParam('orderDirection', options.orderDirection);
    }
    if (options && options.orderBy) {
        uri.addQueryParam('orderBy', options.orderBy);
    }
    if (options && options.offsetType) {
        uri.addQueryParam('offsetType', options.offsetType);
    }
    if (options && options.offsetValue) {
        uri.addQueryParam('offsetValue', options.offsetValue);
    }
    if (options && options.fields && options.fields.length > 0) {
        return fetch_1.postUri(uri, { fields: options.fields.join(',') });
    }
    else {
        return fetch_1.getUri(uri);
    }
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
function getChatterComments(userId, options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/comments");
    if (options && options.fromDate) {
        uri.addQueryParam('fromDate', options.fromDate);
    }
    if (options && options.toDate) {
        uri.addQueryParam('toDate', options.toDate);
    }
    if (options && options.dateType) {
        uri.addQueryParam('dateType', options.dateType);
    }
    if (options.fields && options.fields.length > 0) {
        uri.addQueryParam('fields', options.fields.join(','));
    }
    if (options.limit && options.limit > 0) {
        uri.addQueryParam('limit', options.limit);
    }
    return fetch_1.getUri(uri);
}
exports.getChatterComments = getChatterComments;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
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
function getNnoRegions(userId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/nnoregions");
    return fetch_1.getUri(uri);
}
exports.getNnoRegions = getNnoRegions;
function getLanguage(userId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/languages");
    return fetch_1.getUri(uri);
}
exports.getLanguage = getLanguage;
function getUserSbrs(userId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/sbrs");
    return fetch_1.getUri(uri);
}
exports.getUserSbrs = getUserSbrs;
function getUserTags(userId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/tags");
    return fetch_1.getUri(uri);
}
exports.getUserTags = getUserTags;
function getUserQueueBuddies(userId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId + "/queuebuddies");
    return fetch_1.getUri(uri);
}
exports.getUserQueueBuddies = getUserQueueBuddies;
// update language,roles, sbrs
function updateUserInformation(userId, updateOps) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/users/" + userId);
    return fetch_1.patchUri(uri, updateOps);
}
exports.updateUserInformation = updateUserInformation;
function getAllRoles() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/roles");
    return fetch_1.getUri(uri);
}
exports.getAllRoles = getAllRoles;
function getAllRoleTemplates() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/roleTemplates");
    return fetch_1.getUri(uri);
}
exports.getAllRoleTemplates = getAllRoleTemplates;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function linkKcsResources(kcsLinkedResources, isCertificationCase) {
    if (isCertificationCase === void 0) { isCertificationCase = false; }
    if (isCertificationCase) {
        var uri_1 = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/cases/certification/KnowledgeResources");
        return fetch_1.putUri(uri_1, kcsLinkedResources);
    }
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/resource");
    return fetch_1.postUri(uri, kcsLinkedResources);
}
exports.linkKcsResources = linkKcsResources;
function getSolution(id, revisionId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/solutions/" + id);
    if (revisionId) {
        uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/solutions/" + id + "/revision/" + revisionId);
    }
    return fetch_1.getUri(uri);
}
exports.getSolution = getSolution;
function getResources(caseNumber, options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/resources");
    if (options) {
        if (options.fields && options.fields.length > 0) {
            uri.addQueryParam('fields', options.fields.join(','));
        }
        Object.keys(options)
            .filter(function (k) { return k !== 'fields'; })
            .forEach(function (k) {
            if (options[k] !== undefined) {
                uri.addQueryParam(k, options[k]);
            }
        });
    }
    return fetch_1.getUri(uri);
}
exports.getResources = getResources;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
exports.CaseMilestoneTypes = {
    ONGOING_RESPONES: 'Ongoing Response',
    FIRST_RESPONSE: 'First Response',
    BREACH: 'Breach',
    AMC_FINAL_REMEDY: 'AMC Final Remedy',
    AMC_TEMPORARY_REMEDY: 'AMC Temporary Remedy'
};
// caseId can be id or case number
// Note that fields can't currently be Fields<ICase> since we don't actively type each field and sub relationship field
function getCase(caseId, fields) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId);
    if (fields && fields.length > 0) {
        return fetch_1.postUri(uri, { fields: fields.join(',') });
    }
    else {
        return fetch_1.getUri(uri);
    }
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
// PCM-3403 - it will honor all email settings the same way like SFDC does
function updateCaseByInternal(caseId, kase) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/internal/cases/" + caseId);
    return fetch_1.putUri(uri, kase);
}
exports.updateCaseByInternal = updateCaseByInternal;
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
function getLanguages() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/languages");
    return fetch_1.getUri(uri);
}
exports.getLanguages = getLanguages;
function getCaseSbrs() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/metadata/sbrs");
    return fetch_1.getUri(uri);
}
exports.getCaseSbrs = getCaseSbrs;
function getCaseTags(limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/metadata/tags");
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getCaseTags = getCaseTags;
function updateCaseTags(caseNumber, tagsUpdate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/tags");
    return fetch_1.putUri(uri, tagsUpdate);
}
exports.updateCaseTags = updateCaseTags;
function deleteCaseTags(caseNumber, tagsUpdate) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/tags");
    return fetch_1.deleteUriWithBody(uri, tagsUpdate);
}
exports.deleteCaseTags = deleteCaseTags;
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
function getCaseExternalTrackers(caseId, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/externaltrackers");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
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
function getCaseHistory(caseId, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/history");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getCaseHistory = getCaseHistory;
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
function lockCase(caseId, kase) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/externalLock");
    return fetch_1.putUri(uri, kase);
}
exports.lockCase = lockCase;
function unlockCase(caseId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/externalLock");
    return fetch_1.deleteUri(uri);
}
exports.unlockCase = unlockCase;
function getLockedCases(userId, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/locked/" + userId);
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    if (fields && fields.length > 0) {
        return fetch_1.postUri(uri, { fields: fields.join(',') });
    }
    else {
        return fetch_1.getUri(uri);
    }
}
exports.getLockedCases = getLockedCases;
function getBomgarSessionKey(caseId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/bomgar");
    return fetch_1.getUri(uri);
}
exports.getBomgarSessionKey = getBomgarSessionKey;
function getNep(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/nep");
    return fetch_1.getUri(uri);
}
exports.getNep = getNep;
function createNep(caseNumber, nep) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/nep");
    return fetch_1.postUri(uri, { nep: nep });
}
exports.createNep = createNep;
function updateNep(caseNumber, nep) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/nep");
    return fetch_1.putUri(uri, { nep: nep });
}
exports.updateNep = updateNep;
function deleteNep(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/nep");
    return fetch_1.deleteUri(uri);
}
exports.deleteNep = deleteNep;
function getAttachments(caseNumber, includeDeleted) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/attachments/");
    if (includeDeleted === true) {
        uri.addQueryParam('includeDeleted', includeDeleted);
    }
    return fetch_1.getUri(uri);
}
exports.getAttachments = getAttachments;
function updateAttachment(caseNumber, attachmentId, updateOps) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/attachments/" + attachmentId);
    return fetch_1.patchUri(uri, updateOps);
}
exports.updateAttachment = updateAttachment;
function getBomgarSessions(caseNumber, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/remotesessions");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getBomgarSessions = getBomgarSessions;
function updateCaseSbrs(caseNumber, sbrs) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/sbrs");
    return fetch_1.putUri(uri, sbrs);
}
exports.updateCaseSbrs = updateCaseSbrs;
function deleteCaseSbrs(caseNumber, sbrs) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/sbrs");
    return fetch_1.deleteUriWithBody(uri, sbrs);
}
exports.deleteCaseSbrs = deleteCaseSbrs;
function getMilestones(caseNumber, options) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/milestones");
    if (options && options.fields && options.fields.length > 0) {
        uri.addQueryParam('fields', options.fields.join(','));
    }
    if (options && options.limit !== undefined) {
        uri.addQueryParam('limit', options.limit);
    }
    if (options && options.type) {
        uri.addQueryParam('type', options.type.join(','));
    }
    return fetch_1.getUri(uri);
}
exports.getMilestones = getMilestones;
function getChatTranscripts(caseNumber, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/livechattranscripts");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getChatTranscripts = getChatTranscripts;
function getBugs(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/bugs");
    return fetch_1.getUri(uri);
}
exports.getBugs = getBugs;
function getCasesFromSoql(query) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/soql");
    return fetch_1.postUri(uri, query);
}
exports.getCasesFromSoql = getCasesFromSoql;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function uploadAttachment(caseNumber, formData) {
    var path = "/cwe/cases/" + caseNumber + "/attachments";
    var uri = env_1.default.hydraFSHostName.clone().setPath(env_1.default.fsPathPrefix + path);
    return fetch_1.postFormUri(uri, formData);
}
exports.uploadAttachment = uploadAttachment;
function getAttachments(caseNumber) {
    var path = "/cwe/cases/" + caseNumber + "/attachments";
    var uri = env_1.default.hydraFSHostName.clone().setPath(env_1.default.fsPathPrefix + path);
    return fetch_1.getUri(uri);
}
exports.getAttachments = getAttachments;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getOpenStackVendorProduct(vendorProductPortalId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/" + vendorProductPortalId);
    return fetch_1.getUri(uri);
}
exports.getOpenStackVendorProduct = getOpenStackVendorProduct;
function getOpenStackVendorProductComponents(vendorProductPortalId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/" + vendorProductPortalId + "/components");
    return fetch_1.getUri(uri);
}
exports.getOpenStackVendorProductComponents = getOpenStackVendorProductComponents;
function updateOpenStackVendorProduct(vendorProductPortalId, updateOps) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/openstack/" + vendorProductPortalId);
    return fetch_1.patchUri(uri, updateOps);
}
exports.updateOpenStackVendorProduct = updateOpenStackVendorProduct;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
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
function getCaseNumberFromPortalId(portalId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certs/casenumber");
    if (portalId) {
        uri.addQueryParam('portalId', portalId);
    }
    return fetch_1.getUri(uri);
}
exports.getCaseNumberFromPortalId = getCaseNumberFromPortalId;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getAll(filters) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/all");
    if (filters && Object.keys(filters).length > 0) {
        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
            var key = _a[_i];
            uri.addQueryParam(key, filters[key]);
        }
    }
    var result = fetch_1.getUri(uri);
    return result;
}
exports.getAll = getAll;
function getProgram(id) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/programs/" + id);
    return fetch_1.getUri(uri);
}
exports.getProgram = getProgram;
function getPrograms(filters) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/programs");
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
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/products/" + id);
    return fetch_1.getUri(uri);
}
exports.getRedHatProduct = getRedHatProduct;
function getRedHatProducts(filters) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/products");
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
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/versions/" + id);
    return fetch_1.getUri(uri);
}
exports.getRedHatVersion = getRedHatVersion;
function getRedHatVersions(filters) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/versions");
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
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/platforms/" + id);
    return fetch_1.getUri(uri);
}
exports.getPlatform = getPlatform;
function getPlatforms(filters) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/rhproducts/v2/platforms");
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getCertificationTestPlan(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplan");
    return fetch_1.getUri(uri);
}
exports.getCertificationTestPlan = getCertificationTestPlan;
function updateCertificationTestPlanComponent(caseNumber, testplanComponent) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplan");
    return fetch_1.patchUri(uri, testplanComponent);
}
exports.updateCertificationTestPlanComponent = updateCertificationTestPlanComponent;
function updateCertificationTestPlanItem(caseNumber, testplanItem) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplan");
    return fetch_1.patchUri(uri, testplanItem);
}
exports.updateCertificationTestPlanItem = updateCertificationTestPlanItem;
function updateCertificationExceptionReason(caseNumber, exceptionReason) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/testplan");
    return fetch_1.patchUri(uri, exceptionReason);
}
exports.updateCertificationExceptionReason = updateCertificationExceptionReason;
function getCertificationTestResults(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/certrpms");
    return fetch_1.getUri(uri);
}
exports.getCertificationTestResults = getCertificationTestResults;
function getCertificationTestLog(caseNumber, rpmId, testId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/certrpms/" + rpmId + "/tests/" + testId + "/runtimelog");
    return fetch_1.getUri(uri);
}
exports.getCertificationTestLog = getCertificationTestLog;
function getCertificationSubTestLog(caseNumber, rpmId, testId, subTestId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/certrpms/" + rpmId + "/tests/" + testId + "/subtests/" + subTestId + "/runtimelog");
    return fetch_1.getUri(uri);
}
exports.getCertificationSubTestLog = getCertificationSubTestLog;
function updateResultReview(caseNumber, rpmId, reviewPatch) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/certrpms/" + rpmId);
    return fetch_1.patchUri(uri, reviewPatch);
}
exports.updateResultReview = updateResultReview;
function updateSubTestStatus(caseNumber, rpmId, runNumber, testId, subTestId, updatePatch) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/certrpms/" + rpmId + "/runs/" + runNumber + "/tests/" + testId);
    return fetch_1.patchUri(uri, updatePatch);
}
exports.updateSubTestStatus = updateSubTestStatus;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function allCounts(caseId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseId + "/count");
    return fetch_1.getUri(uri);
}
exports.allCounts = allCounts;
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
function testPlan(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/count/testplan");
    return fetch_1.getUri(uri);
}
exports.testPlan = testPlan;
function testResult(caseNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cwe/certcases/" + caseNumber + "/count/certrpms");
    return fetch_1.getUri(uri);
}
exports.testResult = testResult;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getSbr(sbrId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/sbrs/" + sbrId);
    return fetch_1.getUri(uri);
}
exports.getSbr = getSbr;
function getSbrTags(sbrId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/sbrs/" + sbrId + "/tags");
    return fetch_1.getUri(uri);
}
exports.getSbrTags = getSbrTags;
function getSbrs() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/sbrs");
    return fetch_1.getUri(uri);
}
exports.getSbrs = getSbrs;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getAccount(accountNumber, fields) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber);
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    return fetch_1.getUri(uri);
}
exports.getAccount = getAccount;
function getAccountContacts(accountNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber + "/contacts");
    return fetch_1.getUri(uri);
}
exports.getAccountContacts = getAccountContacts;
function getAccountNotes(accountNumber, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber + "/notes");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getAccountNotes = getAccountNotes;
function getAccountTeamMembers(accountNumber, fields, limit) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts/" + accountNumber + "/associates");
    if (fields && fields.length > 0) {
        uri.addQueryParam('fields', fields.join(','));
    }
    if (limit !== undefined) {
        uri.addQueryParam('limit', limit);
    }
    return fetch_1.getUri(uri);
}
exports.getAccountTeamMembers = getAccountTeamMembers;
function patchAccounts(accounts) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/accounts");
    return fetch_1.patchUri(uri, accounts);
}
exports.patchAccounts = patchAccounts;
function getContactDetailBySso(sso) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/contacts/sso/" + sso);
    return fetch_1.getUri(uri);
}
exports.getContactDetailBySso = getContactDetailBySso;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function createCommentFeedback(caseNumber, comment) {
    var uri = env_1.default.pcmHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
    return fetch_1.postUri(uri, comment);
}
exports.createCommentFeedback = createCommentFeedback;
function updateCommentFeedback(caseNumber, comment) {
    var uri = env_1.default.pcmHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
    return fetch_1.putUri(uri, comment);
}
exports.updateCommentFeedback = updateCommentFeedback;
function getCommentFeedback(caseNumber) {
    var uri = env_1.default.pcmHostName.clone().setPath(env_1.default.pathPrefix + "/cases/" + caseNumber + "/comments/feedback");
    return fetch_1.getUri(uri);
}
exports.getCommentFeedback = getCommentFeedback;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function createRole(role) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/roles/");
    return fetch_1.postUri(uri, role);
}
exports.createRole = createRole;
function updateRole(roleId, role) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/roles/" + roleId);
    return fetch_1.putUri(uri, role);
}
exports.updateRole = updateRole;
function deleteRole(roleId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/roles/" + roleId);
    return fetch_1.deleteUri(uri);
}
exports.deleteRole = deleteRole;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getVocabularyTags() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/vocabulary/tag");
    return fetch_1.getUri(uri);
}
exports.getVocabularyTags = getVocabularyTags;
function getVocabularyProducts() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/vocabulary/product");
    return fetch_1.getUri(uri);
}
exports.getVocabularyProducts = getVocabularyProducts;
function getVocabularySbrs() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/vocabulary/sbr");
    return fetch_1.getUri(uri);
}
exports.getVocabularySbrs = getVocabularySbrs;
function getVocabularyCategory() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/vocabulary/category");
    return fetch_1.getUri(uri);
}
exports.getVocabularyCategory = getVocabularyCategory;
function getVocabularyComponents() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/vocabulary/component");
    return fetch_1.getUri(uri);
}
exports.getVocabularyComponents = getVocabularyComponents;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getMaintenanceMode(configurationType) {
    if (configurationType === void 0) { configurationType = 'ascension_maintenance'; }
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/configuration/" + configurationType);
    return fetch_1.getUri(uri);
}
exports.getMaintenanceMode = getMaintenanceMode;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __webpack_require__(2);
var contact_1 = __webpack_require__(3);
function getBugzillaCommentFields(options) {
    var finalFields = [];
    var fields = [
        'id',
        'bugzillaBugId',
        'bugzillaId',
        'caseCommentId',
        'createdById',
        'createdDate',
        'isPrivate',
        'lastModifiedById',
        'lastModifiedDate'
    ];
    // Not yet mapped as we have no need for it.
    // 'bugzillaBug',
    Array.prototype.push.apply(finalFields, fields);
    if (options && options.includeCreatedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdBy." + f; }));
    }
    if (options && options.includeLastModifiedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedBy." + f; }));
    }
    return finalFields;
}
exports.getBugzillaCommentFields = getBugzillaCommentFields;
function getCaseCommentFields(options) {
    var finalFields = [];
    if (options && options.minimal === true) {
        var minimalFields = [
            'id',
            'commentBody',
            'caseNumber',
            'createdDate',
            'createdByText',
            'createdByLink',
            'doNotChangeSBT',
            'externalHandlingSystem',
            'hoursWorked',
            'isPublic',
            'lastModifiedDate',
            'sbt',
            'sortDate'
        ];
        Array.prototype.push.apply(finalFields, minimalFields);
    }
    else {
        var fields = [
            'id',
            'bugzillaCommentId',
            'caseNumber',
            'caseCommentId',
            'caseID',
            'commentBody',
            'createdById',
            'createdDate',
            'createdByContactID',
            'createdByText',
            'createdByLink',
            'createdByUserID',
            'createdWithBug',
            'doNotChangeSBT',
            'externalHandlingSystem',
            'fromBug',
            'hoursWorked',
            'inBreach',
            'isDraft',
            'isPublic',
            'lastModifiedById',
            'lastModifiedDate',
            'lastReferencedDate',
            'lastModifiedByContactID',
            'lastModifiedByText',
            'lastModifiedByUserID',
            'lastModifiedDateCustom',
            'name',
            'sbt',
            'sortDate',
            'targetDate'
        ];
        Array.prototype.push.apply(finalFields, fields);
    }
    if (options && options.includeUncommonFields) {
        var uncommonFields = [
            'caseCommentCreatedDayOfWeek',
            'caseCommentCreatedHourOfDay',
            'caseCommentCreatedByLocation',
            'connectionReceivedId',
            'connectionSentId',
            'externalCaseCommentId',
            'externalId',
            'externalTrackerToPartnerPrivateMap',
            'helpsResolutionScore',
            'lastModifiedByLink',
            'lastViewedDate',
            'lastModifiedByIdCustom',
            'prsRecordID',
            'lastVotedOnHelpsResolutionAt',
            'representedInOtherSystemsAs',
            'roleOfCreatedBy',
            'isDeleted',
            'managerOfCreatedBy',
            'milestoneTargetDate',
            'publishedDate',
            'publishedMs',
            'rhLocation',
            'searchHelper',
            'systemModstamp',
        ];
        Array.prototype.push.apply(finalFields, uncommonFields);
    }
    if (options && options.includeBugzillaComment) {
        Array.prototype.push.apply(finalFields, getBugzillaCommentFields(options).map(function (f) { return "bugzillaComment." + f; }));
    }
    if (options && options.includeCreatedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "createdByUser." + f; }));
    }
    if (options && options.includeLastModifiedByUser) {
        Array.prototype.push.apply(finalFields, user_1.getUserFields(options).map(function (f) { return "lastModifiedByUser." + f; }));
    }
    if (options && options.includeCreatedByContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "createdByContact." + f; }));
    }
    if (options && options.includeLastModifiedByContact) {
        Array.prototype.push.apply(finalFields, contact_1.getContactFields(options).map(function (f) { return "lastModifiedByContact." + f; }));
    }
    return finalFields;
}
exports.getCaseCommentFields = getCaseCommentFields;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getMetadata() {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/metadata");
    return fetch_1.getUri(uri);
}
exports.getMetadata = getMetadata;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
// success Plan
function getSuccessPlansForUserName(ssoUsername) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans");
    uri.addQueryParam('username', ssoUsername);
    return fetch_1.getUri(uri);
}
exports.getSuccessPlansForUserName = getSuccessPlansForUserName;
function getSuccessPlansForAccountNumber(accountNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/accounts/" + accountNumber);
    return fetch_1.getUri(uri);
}
exports.getSuccessPlansForAccountNumber = getSuccessPlansForAccountNumber;
function getSuccessPlansForId(successPlanId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId);
    return fetch_1.getUri(uri);
}
exports.getSuccessPlansForId = getSuccessPlansForId;
function addSuccessPlan(successPlan) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans");
    return fetch_1.postUri(uri, successPlan);
}
exports.addSuccessPlan = addSuccessPlan;
function updateSuccessPlan(successPlanId, successPlan) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId);
    return fetch_1.putUri(uri, successPlan);
}
exports.updateSuccessPlan = updateSuccessPlan;
function removeSuccessPlan(successPlanId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId);
    return fetch_1.deleteUri(uri);
}
exports.removeSuccessPlan = removeSuccessPlan;
// Products
function addProduct(successPlanId, product) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/products");
    return fetch_1.postUri(uri, product);
}
exports.addProduct = addProduct;
function updateProduct(product) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + product.successPlanId + "/products/" + product.id);
    return fetch_1.putUri(uri, product);
}
exports.updateProduct = updateProduct;
function removeProduct(successPlanId, productId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/products/" + productId);
    return fetch_1.deleteUri(uri);
}
exports.removeProduct = removeProduct;
// Objectives
function addObjective(successPlanId, objective) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives");
    return fetch_1.postUri(uri, objective);
}
exports.addObjective = addObjective;
function updateObjective(objective) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + objective.successPlanId + "/objectives/" + objective.id);
    return fetch_1.putUri(uri, objective);
}
exports.updateObjective = updateObjective;
function removeObjective(successPlanId, objectiveId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + objectiveId);
    return fetch_1.deleteUri(uri);
}
exports.removeObjective = removeObjective;
// objective doclinks
function addObjectiveLink(successPlanId, objectiveId, doclink) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + objectiveId + "/doclinks");
    return fetch_1.postUri(uri, doclink);
}
exports.addObjectiveLink = addObjectiveLink;
function updateObjectiveLink(successPlanId, doclink) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + doclink.objectiveId + "/doclinks/" + doclink.id);
    return fetch_1.putUri(uri, doclink);
}
exports.updateObjectiveLink = updateObjectiveLink;
function removeObjectiveLink(successPlanId, objectiveId, doclinkId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + objectiveId + "/doclinks/" + doclinkId);
    return fetch_1.deleteUri(uri);
}
exports.removeObjectiveLink = removeObjectiveLink;
// Objective Stakeholders
function addObjectiveStakeholder(successPlanId, objectiveId, stakeholder) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + objectiveId + "/stakeholders");
    return fetch_1.postUri(uri, stakeholder);
}
exports.addObjectiveStakeholder = addObjectiveStakeholder;
function updateObjectiveStakeholder(successPlanId, stakeholder) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + stakeholder.objectiveId + "/stakeholders/" + stakeholder.id);
    return fetch_1.putUri(uri, stakeholder);
}
exports.updateObjectiveStakeholder = updateObjectiveStakeholder;
function removeObjectiveStakeholder(successPlanId, objectiveId, stakeholderId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/successplans/" + successPlanId + "/objectives/" + objectiveId + "/stakeholders/" + stakeholderId);
    return fetch_1.deleteUri(uri);
}
exports.removeObjectiveStakeholder = removeObjectiveStakeholder;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
// TODO: Need to create Params interface.
function getCSAccounts(params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/accounts/");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getCSAccounts = getCSAccounts;
function getOpenCaseCount(accountNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/accounts/" + accountNumber + "/cases/count");
    return fetch_1.getUri(uri);
}
exports.getOpenCaseCount = getOpenCaseCount;
function getCTACount(accountNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/accounts/" + accountNumber + "/ctas/count");
    return fetch_1.getUri(uri);
}
exports.getCTACount = getCTACount;
function getEntitlementCount(accountNumber) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/accounts/" + accountNumber + "/entitlements/count");
    return fetch_1.getUri(uri);
}
exports.getEntitlementCount = getEntitlementCount;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function listCtas(params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.listCtas = listCtas;
function getCtaGroupedCount(params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/count");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getCtaGroupedCount = getCtaGroupedCount;
function getCta(ctaId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId);
    return fetch_1.getUri(uri);
}
exports.getCta = getCta;
function updateCta(ctaId, ctaDetails) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId);
    return fetch_1.putUri(uri, ctaDetails);
}
exports.updateCta = updateCta;
function addCta(ctaDetails) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas");
    return fetch_1.postUri(uri, ctaDetails);
}
exports.addCta = addCta;
function deleteCta(ctaId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId);
    return fetch_1.deleteUri(uri);
}
exports.deleteCta = deleteCta;
function getCtaTasks(ctaId, params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/tasks");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getCtaTasks = getCtaTasks;
function updateCtaTask(taskId, ctaId, taskDetails) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/tasks/" + taskId);
    return fetch_1.putUri(uri, taskDetails);
}
exports.updateCtaTask = updateCtaTask;
function addTask(ctaId, taskDetails) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/tasks");
    return fetch_1.postUri(uri, taskDetails);
}
exports.addTask = addTask;
function deleteTask(taskId, ctaId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/tasks/" + taskId);
    return fetch_1.deleteUri(uri);
}
exports.deleteTask = deleteTask;
function getCtaComments(ctaId, params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/comments");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getCtaComments = getCtaComments;
function getCtaComment(commentId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + commentId);
    return fetch_1.getUri(uri);
}
exports.getCtaComment = getCtaComment;
function updateCtaComment(commentId, ctaId, comment) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/comments/" + commentId);
    return fetch_1.putUri(uri, comment);
}
exports.updateCtaComment = updateCtaComment;
function addCtaComment(ctaId, comment) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/comments");
    return fetch_1.postUri(uri, comment);
}
exports.addCtaComment = addCtaComment;
function deleteCtaComment(commentId, ctaId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/ctas/" + ctaId + "/comments/" + commentId);
    return fetch_1.deleteUri(uri);
}
exports.deleteCtaComment = deleteCtaComment;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __webpack_require__(0);
var fetch_1 = __webpack_require__(1);
function getTimeline(params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/timeline");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getTimeline = getTimeline;
function getTimelineActivity(activityId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/timeline/" + activityId);
    return fetch_1.getUri(uri);
}
exports.getTimelineActivity = getTimelineActivity;
function updateTimelineActivity(activityId, activity) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/timeline/" + activityId);
    return fetch_1.putUri(uri, activity);
}
exports.updateTimelineActivity = updateTimelineActivity;
function addTimelineActivity(activity) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/timeline");
    return fetch_1.postUri(uri, activity);
}
exports.addTimelineActivity = addTimelineActivity;
function deleteTimelineActivity(activityId) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/timeline/" + activityId);
    return fetch_1.deleteUri(uri);
}
exports.deleteTimelineActivity = deleteTimelineActivity;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __webpack_require__(1);
var env_1 = __webpack_require__(0);
function getContacts(params) {
    var uri = env_1.default.hydraHostName.clone().setPath(env_1.default.pathPrefix + "/cs/contacts/");
    params && Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined) {
            uri.addQueryParam(k, params[k]);
        }
    });
    return fetch_1.getUri(uri);
}
exports.getContacts = getContacts;


/***/ })
/******/ ]);
});