"use strict";
angular.module("RedhatAccess.cases").service("SOLRGrammarService",[
    'RHAUtils',
    function (RHAUtils) {

        // escaped from solrGrammar.txt
        this.grammarString = 'query = sequence\r\n\r\nsequence = first:sequencePart cont:sequenceCont { return first + cont; }\r\nsequenceCont = orSequence \/ andSequence \/ \"\"\r\n\r\nandSequence = parts:(\" and \" sequencePart)+ { return [].concat.apply([], parts).join(\"\"); }\r\norSequence = parts:(\" or \" sequencePart)+ { return [].concat.apply([], parts).join(\"\"); }\r\nsequencePart = criteria \/ \"(\" sq:sequence \")\" { return \'(\' + sq + \')\' }\r\n\r\n\r\ncriteria = basicCriteria \/ notCriteria\r\nnotCriteria = \"-\"criteria:basicCriteria {return \'-\' + criteria; }\r\nbasicCriteria = field:basicFieldName \":\"\" \"* value:value { return field + \":\" + value; }\r\n\/ field:severityFieldName \":\"\" \"* value:severityValue { return field + \":\" + value; }\r\n\/ field:statusFieldName \":\"\" \"* value:statusValue { return field + \":\" + value; }\r\n\/ field:groupFieldName \":\"\" \"* value:groupValue { return field + \":\" + value; }\r\n\/ field:productFieldName \":\"\" \"* value:productValue { return field + \":\" + value; }\r\n\/ field:ftsFieldName \":\"\" \"* value:booleanValue { return field + \":\" + value; }\r\n\/ field:accountNumberFieldName \":\"\" \"* value:accountNumberValue { return field + \":\" + value; }\r\n\r\nvalue = range \/ string\r\nrange = \"[\" from:([^\" \"]+) \" TO \" to:([^\\]]+) \"]\" {return \"[\" + from.join(\"\") + \" TO \" + to.join(\"\") + \"]\"; }\r\nstring = value:([^\" \")]+) { return value.join(\"\"); } \/ \"\\\"\"value:([^\\\"]+)\"\\\"\" { return \'\"\' + value.join(\"\") + \'\"\'; }\r\nbooleanValue = \"true\" \/ \"false\"\r\nnumber = [0-9]+\r\n\r\nbasicFieldName = \"accountName\" {return \"case_account_name\";}\r\n\/ \"contactName\" {return \"case_contactName\";}\r\n\/ \"createdByName\" {return \"case_createdByName\";}\r\n\/ \"createdDate\" {return \"case_createdDate\";}\r\n\/ \"description\" {return \"case_description\";}\r\n\/ \"summary\" {return \"case_summary\";}\r\n\/ \"productVersion\" {return \"case_version\";}\r\n\/ \"lastModifiedDate\" {return \"case_lastModifiedDate\";}\r\n\/ \"lastModifiedByName\" {return \"case_lastModifiedByName\";}\r\n\/ \"owner\" {return \"case_owner\";}\r\n\/ \"language\" {return \"language\";}\r\n\r\nftsFieldName = \"FTS\" {return \"case_24_7\";}\r\n\r\nseverityFieldName = \"severity\" {return \"case_severity\";}\r\nseverityValue = string\r\n\r\nstatusFieldName = \"status\" {return \"case_status\";}\r\nstatusValue = string\r\n\r\ngroupFieldName = \"group\" {return \"case_folderNumber\";}\r\ngroupValue = string\r\n\r\nproductFieldName = \"productName\" { return \"case_product\"; }\r\nproductValue = string\r\n\r\naccountNumberFieldName = \"accountNumber\" {return \"case_accountNumber\";}\r\naccountNumberValue = number';

        this.parser = null;

        this.init = function() {
            console.log(this.grammarString);
            var a = new Date();
            this.parser =  PEG.buildParser(this.grammarString);
            console.log(new Date() - a);
        };

        this.parse = function (stringQuery) {
            return this.parser.parse(stringQuery);
        };

        this.setSeverities = function (severities) {
            if(RHAUtils.isEmpty(severities)) return;

            var severitiesValues = severities.map(function (severity) {
                return '"\\"' + severity.name + '\\"" { return \'"' + severity.name + '"\'; }';
            }).join(' / ');
            var severityRule = 'severityValue = ' + severitiesValues;

            this.grammarString = this.grammarString.replace(/severityValue\s*=.+/,severityRule);

            this.init();
        };

        this.setStatuses = function (statuses) {
            if(RHAUtils.isEmpty(statuses)) return;

            var statusValues = statuses.map(function(status) {
                return '"\\"' + status.name + '\\"" { return \'"' + status.name + '"\'; }';
            }).join(' / ');
            var statusRule = 'statusValue = ' + statusValues;

            this.grammarString = this.grammarString.replace(/statusValue\s*=.+/, statusRule);

            this.init();
        };

        this.setGroups = function (groups)  {
            if(RHAUtils.isEmpty(groups)) return;

            var groupValues = groups.map(function (group) {
                return '"\\"' + group.name + '\\"" { return \'' + group.number + '\'; }';
            }).join(' / ');
            var groupRule = 'groupValue = ' + groupValues;

            this.grammarString = this.grammarString.replace(/groupValue\s*=.+/, groupRule);

            this.init();
        };

        this.setProducts = function(products) {
            if(RHAUtils.isEmpty(products)) return;

            var productValues = products.map(function (product) {
               return '"\\"' + product.name + '\\"" { return \'"' + product.code + '"\'; }';
            }).join(' / ');
            var productRule = 'productValue = ' + productValues;

            this.grammarString = this.grammarString.replace(/productValue\s*=.+/,productRule);

            this.init();
        };

        this.setBookmarkedAccounts = function(accounts) {
          if(RHAUtils.isEmpty(accounts)) return;

            var numberValues = accounts.map(function (account) {
                return '"\\"' + account.number + ' (' + account.name + ')\\"" { return "' + account.number + '"; }';
            }).join(' / ');
            var numberRule = "accountNumberValue = number / " + numberValues;

            this.grammarString = this.grammarString.replace(/accountNumberValue\s*=.+/, numberRule);
            this.init();
        };

        this.init();
    }
]);
