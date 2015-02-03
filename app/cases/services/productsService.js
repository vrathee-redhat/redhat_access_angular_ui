'use strict';
angular.module('RedhatAccess.cases').service('ProductsService', [
	'$http',
	'securityService',
	'strataService',
    'CaseService',
    'AttachmentsService',
	'RHAUtils',
	'NEW_CASE_CONFIG',
	'NEW_DEFAULTS',
	function ($http, securityService, strataService, CaseService, AttachmentsService, RHAUtils, NEW_CASE_CONFIG, NEW_DEFAULTS) {
    this.products = [];
    this.productsDisabled = false;
    this.productsLoading = false
    this.versions = [];
    this.versionDisabled = false;
    this.versionLoading = false;
    this.getProducts = function () {
        this.productsLoading = true;
        strataService.products.list(securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function(response) {
        	this.products = response;
            this.buildProductOptions();
            this.productsLoading = false;
            if (RHAUtils.isNotEmpty(NEW_DEFAULTS.product)) {
                for(var i = 0; i < this.products.length; i++){
                    if(this.products[i].label === NEW_DEFAULTS.product){
                        CaseService.kase.product = this.products[i].value;
                        break;
                    }
                }
                //$scope.getRecommendations();
                //TODO wire up recommendations service
            } 
            this.getVersions(CaseService.kase.product);
        }), function (error) {
            AlertService.addStrataErrorMessage(error);
        });
    };

    this.buildProductOptions = function() {
        var productOptions = [];
        var productSortList = [];
        if(NEW_CASE_CONFIG.isPCM){
            $http.get(NEW_CASE_CONFIG.productSortListFile).then(angular.bind(this, function (response) {
                if (response.status === 200 && response.data !== undefined) {
                    productSortList = response.data.split(',');

                    for(var i = 0; i < productSortList.length; i++) {
                        for (var j = 0 ; j < this.products.length ; j++) {
                            if (productSortList[i] === this.products[j].code) {
                                var sortProduct = productSortList[i];
                                productOptions.push({
                                    value: sortProduct,
                                    label: sortProduct
                                });
                                break;
                            }
                        }
                    }

                    var sep = '────────────────────────────────────────';
                    if (productOptions.length > 0) {
                        productOptions.push({
                            isDisabled: true,
                            label: sep
                        });
                    }

                    angular.forEach(this.products, function(product){
                        productOptions.push({
                            value: product.code,
                            label: product.name
                        });
                    }, this);

                    this.products = productOptions;
                } else {
                    angular.forEach(this.products, function(product){
                        productOptions.push({
                            value: product.code,
                            label: product.name
                        });
                    }, this);
                    this.products = productOptions;
                }
            }));
        } else {
            angular.forEach(this.products, function(product){
                productOptions.push({
                    value: product.code,
                    label: product.name
                });
            }, this);
            this.products = productOptions;
        }
    };
    this.fetchProductDetail = function (productCode) {
        AttachmentsService.suggestedArtifact = {};
        strataService.products.get(productCode).then(angular.bind(this, function (product) {
            if (product !== undefined && product.suggested_artifacts !== undefined && product.suggested_artifacts.suggested_artifact !== undefined) {
                if (product.suggested_artifacts.suggested_artifact.length > 0) {
                    var description = product.suggested_artifacts.suggested_artifact[0].description;
                    if (description.indexOf('<a') > -1) {
                        description = description.replace("<a","<a target='_blank'");
                    }
                    AttachmentsService.suggestedArtifact.description = description;
                }
            }
        }), function (error) {
            AlertService.addStrataErrorMessage(error);
        });
    };
    this.getVersions = function (product) {
        this.versionDisabled = true;
        this.versionLoading = true;
        strataService.products.versions(product).then(angular.bind(this, function (response) {
            this.versions = response;
            this.versionDisabled = false;
            this.versionLoading = false;
			//Fetch Recommendations
        }), function (error) {
            AlertService.addStrataErrorMessage(error);
        });

        //Retrieve the product detail, basically finding the attachment artifact
        this.fetchProductDetail(product);
    };
    this.showVersionSunset = function () {
        if (RHAUtils.isNotEmpty(CaseService.kase.product) && RHAUtils.isNotEmpty(CaseService.kase.version)) {
            if ((CaseService.kase.version).toLowerCase().indexOf('- eol') > -1) {
                return true;
            }
        }
        return false;
    };
}]);