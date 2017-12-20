'use strict';

export default class LinkifyService {
    constructor($filter, RHAUtils) {
        this.linkifyWithCaseIDs = function (text) {
            if (RHAUtils.isEmpty(text)) return '';

            var caseIdRegex = /([\s\('"]|^)(\d{8})([\s\)'"\.]|$)/g;
            var caseLinkRegex = /<a href="#\/case\/\d{8}">\d{8}<\/a>/g;
            var caseLinksinkifiedText = text.replace(caseIdRegex, '$1<a href="#/case/$2">$2</a>$3');
            var textSegments = caseLinksinkifiedText.split(caseLinkRegex);
            var caseLinks = caseLinksinkifiedText.match(caseLinkRegex);
            // merge the elements back together and linkify textSegments
            try {
                var result = [$filter('linky')(textSegments[0], '_blank')];
                for (var i = 1; i < textSegments.length; i++) {
                    result.push(caseLinks[i - 1]);
                    result.push($filter('linky')(textSegments[i], '_blank'));
                }
                return result.join('');
            } catch(error) {
                // https://projects.engineering.redhat.com/browse/PCM-6168
                // Returning comment text as it is if there is any error while linkifying the content inside the comment text
                return text;
            }

        }
    }
}
