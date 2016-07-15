'use strict';

const productSortListFile = require('../../../productSortList.txt');

export default class ProductsService {
    constructor(securityService, strataService, CaseService, AttachmentsService, RHAUtils, NEW_CASE_CONFIG, NEW_DEFAULTS, AlertService) {
        'ngInject';

        this.products = [];
        this.productsDisabled = false;
        this.productsLoading = false;
        this.versions = [];
        this.versionDisabled = false;
        this.versionLoading = false;
        this.clear = function () {
            this.products = [];
            this.versions = [];
        };
        this.getProducts = function (fetchForContact) {
            this.clear();
            var contact = securityService.loginStatus.authedUser.sso_username;
            if (fetchForContact === true) {
                if (securityService.loginStatus.authedUser.is_internal) {
                    if (RHAUtils.isNotEmpty(CaseService.owner)) {
                        contact = CaseService.owner;  // When internal user creates case for another account
                    }
                }
            } else {
                this.productsLoading = true;
                if (securityService.loginStatus.authedUser.is_internal) {
                    if (RHAUtils.isNotEmpty(CaseService.kase.contact_sso_username)) {
                        contact = CaseService.kase.contact_sso_username; // When internal user views case of another account
                    }
                }
            }
            return strataService.products.list(contact).then(angular.bind(this, function (response) {
                this.products = response;
                this.buildProductOptions();
                this.productsLoading = false;
                if (RHAUtils.isNotEmpty(NEW_DEFAULTS.product)) {
                    for (var i = 0; i < this.products.length; i++) {
                        if (this.products[i].label === NEW_DEFAULTS.product) {
                            CaseService.kase.product = this.products[i].value;
                            break;
                        }
                    }
                }
                if (RHAUtils.isNotEmpty(CaseService.kase.product)) {
                    //once we retrieve the product list, we should also retrieve versions
                    this.getVersions(CaseService.kase.product);
                }
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.buildProductOptions = function () {
            var productOptions = [];
            var productSortList = [];
            if (NEW_CASE_CONFIG.isPCM) {
                productSortList = productSortListFile.split(',');
                for (var i = 0; i < productSortList.length; i++) {
                    for (var j = 0; j < this.products.length; j++) {
                        if (productSortList[i] === this.products[j].code) {
                            var sortProduct = productSortList[i];
                            productOptions.push({
                                code: sortProduct,
                                name: sortProduct
                            });
                            break;
                        }
                    }
                }

                // TODO -- This comes through as garbled text in the html select, using dashes until we figure it out
                // var sep = '────────────────────────────────────────';
                const sep = '----------------------------------------';
                if (productOptions.length > 0) {
                    productOptions.push({ isDisabled: true, name: sep });
                }

                angular.forEach(this.products, (product) => productOptions.push({code: product.code, name: product.name}) );
                this.products = productOptions;
            } else {
                angular.forEach(this.products, (product) => productOptions.push({code: product.code, name: product.name}) );
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
                            description = description.replace("<a", "<a target='_blank'");
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
            //Retrieve the product detail, basically finding the attachment artifact
            this.fetchProductDetail(product);
            return strataService.products.versions(product).then(angular.bind(this, function (response) {
                response.sort(function (a, b) { //Added because of wrong order of versions
                    a = a.split('.');
                    b = b.split('.');
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] < b[i]) {
                            return 1;
                        } else if (b[i] < a[i]) {
                            return -1;
                        }
                    }
                    if (a.length > b.length) {
                        return 1;
                    } else if (b.length > a.length) {
                        return -1;
                    }
                    return 0;
                });
                this.versions = response;
                this.versionDisabled = false;
                this.versionLoading = false;

                // if(RHAUtils.isNotEmpty(CaseService.kase.version) && (this.versions.indexOf(CaseService.kase.version) === -1))
                // {
                //     //this will get executed when existing product version is not available in version list of the given product
                //     //in this case drop down value is shown as 'Select an Option' and at that point submit button should be disabled
                //     CaseService.newCaseIncomplete = true;
                // }
                //Fetch Recommendations
                return response;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
        this.showVersionSunset = function () {
            if (RHAUtils.isNotEmpty(CaseService.kase.product) && RHAUtils.isNotEmpty(CaseService.kase.version)) {
                if ((CaseService.kase.version).toLowerCase().indexOf('- eol') > -1) {
                    return true;
                }
            }
            return false;
        };
    }
}
