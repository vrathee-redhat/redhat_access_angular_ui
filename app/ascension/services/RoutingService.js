'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('RoutingService', [
    'securityService',
    'UQL',
    'RHAUtils',
    function (securityService, UQL,RHAUtils) {

        var makeSbrConds = function (user) {
            var sbrConds = [];
            //if not weekend then only consider SBR group, otherwise associates should work on all cases irrespective of SBR
            if (!RHAUtils.isWeeekend() && RHAUtils.isNotEmpty(user.resource.sbrs)) {
                angular.forEach(user.resource.sbrs, function (s) {
                    sbrConds.push(UQL.cond('sbrGroup', 'is', "\"" + s + "\""));
                });
            }
            return UQL.or.apply(null, sbrConds);
        };

        this.OWNED_CASES = function(user) {
            var ftsCond, ftsRoleCond, internalStatusCond, notClosedCond, ownerCond, wocCond, wooCond, worhCond;
            internalStatusCond = UQL.cond('internalStatus', 'is', '"Waiting on Owner"');
            ownerCond = UQL.cond('ownerId', 'is', "\"" + user.externalModelId + "\"");
            worhCond = UQL.cond('status', 'is', '"Waiting on Red Hat"');
            wocCond = UQL.cond('status', 'is', '"Waiting on Customer"');
            wooCond = UQL.cond('internalStatus', 'is', '"Waiting on Owner"');
            ftsCond = UQL.cond('isFTS', 'is', true);
            ftsRoleCond = UQL.cond('ftsRole', 'like', "\"" + escape('%')+ user.resource.kerberos +escape('%')+ "\"");
            notClosedCond = UQL.cond('status', 'ne', '"Closed"');
            return UQL.or(UQL.and(ownerCond, UQL.or(worhCond, wooCond)), UQL.and(ftsRoleCond, notClosedCond));
        };

        this.COLLABORATION = function(user) {
            var nnoSuperRegionCond, notClosedCond, wocCond;
            wocCond = UQL.cond('internalStatus', 'is', '"Waiting on Collaboration"');
            notClosedCond = UQL.cond('status', 'ne', '"Closed"');
            nnoSuperRegionCond = UQL.cond('nnoSuperRegion', 'is', 'null');
            return UQL.and(UQL.and(wocCond, UQL.and(notClosedCond, makeSbrConds(user))), nnoSuperRegionCond);

        };

        this.CONTRIBUTOR = function(user) {
            var contributorCond, ownerCond, wocCond, worhCond;
            ownerCond = UQL.cond('userId', 'is', "\"" + user.id + "\"");
            worhCond = UQL.cond('caseStatus', 'is', '"Waiting on Red Hat"');
            wocCond = UQL.cond('caseInternalStatus', 'is', '"Waiting on Contributor"');
            contributorCond = UQL.cond('roleName', 'is', '"Contributor"');
            return UQL.and(ownerCond, UQL.and(worhCond, UQL.and(wocCond, contributorCond)));
        };
        this.FTS = function(user) {
            "Filters\nNo owner/role for User's current Geo on ticket\n24x7 equals \"TRUE\"\nSBR Group includes \"<group1>,<group2>\"(Matches users current SBRs)";
            var ftsCond, ftsRoleCond;
            ftsCond = UQL.cond('isFTS', 'is', true);
            ftsRoleCond = UQL.cond('ftsRole', 'is', '""');
            return UQL.and(ftsCond, UQL.and(ftsRoleCond, makeSbrConds(user)));
        };
        this.NNO_SUPER_REGION = function(user, super_region) {
            "NNO = \"NA\"\nSBR Group includes \"<group1>,<group2>\"(Matches users current SBRs)";
            var nnoRegionCond;
            nnoRegionCond = UQL.cond('nnoSuperRegion', 'is', "\"" + super_region + "\"");
            return UQL.and(nnoRegionCond, makeSbrConds(user));
        };

        this.NNO_NA = function(user) {
            return this.NNO_SUPER_REGION(user, 'NA');
        };

        this.NNO_APAC = function(user) {
            return this.NNO_SUPER_REGION(user, 'APAC');
        };

        this.NNO_INDIA = function(user) {
            return this.NNO_SUPER_REGION(user, 'INDIA');
        };

        this.NNO_EMEA = function(user) {
            return this.NNO_SUPER_REGION(user, 'EMEA');
        };
        this.NCQ = function(user) {
            var notClosedCond, unassignedCond;
            unassignedCond = UQL.cond('internalStatus', 'is', "\"Unassigned\"");
            notClosedCond = UQL.cond('status', 'ne', "\"Closed\"");
            return UQL.and(unassignedCond, UQL.and(notClosedCond, makeSbrConds(user)));
        };
        this.ENGG_BACKLOG = function(user){
            var worCond, woeCond;
            woeCond = UQL.cond('internalStatus', 'is', '"Waiting on Engineering"');
            worCond = UQL.cond('status', 'is', '"Waiting on Red Hat"');
            return UQL.and(woeCond,worCond);
        };

        this.key_mapping = {
            OWNED_CASES: "ascension-owned-cases",
            COLLABORATION: "ascension-collaboration",
            NNO_APAC: "ascension-nno-apac",
            NNO_NA: "ascension-nno-na",
            NNO_INDIA: "ascension-nno-india",
            NNO_EMEA: "ascension-nno-emea",
            FTS: "ascension-fts",
            NCQ: "ascension-ncq",
            ENGG_BACKLOG: "ascension-engg-backlog"
        };

        this.mapping = {
            "owned_cases": this.OWNED_CASES,
            "ascension-owned-cases": this.OWNED_CASES,
            "collaboration": this.COLLABORATION,
            "ascension-collaboration": this.COLLABORATION,
            "nno_apac": this.NNO_APAC,
            "ascension-nno-apac": this.NNO_APAC,
            "nno_na": this.NNO_NA,
            "ascension-nno-na": this.NNO_NA,
            "nno_india": this.NNO_INDIA,
            "ascension-nno-india": this.NNO_INDIA,
            "nno_emea": this.NNO_EMEA,
            "ascension-nno-emea": this.NNO_EMEA,
            "fts": this.FTS,
            "ascension-fts": this.FTS,
            "ncq": this.NCQ,
            "ascension-ncq": this.NCQ,
            "engg_backlog": this.ENGG_BACKLOG,
            "ascension-engg-backlog": this.ENGG_BACKLOG
        };
    }
]);
