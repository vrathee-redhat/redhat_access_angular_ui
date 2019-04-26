import hydrajs from './hydrajs';
import { TnC } from './constants';


export function getTnCHost() {
  const env = hydrajs.Env.getEnvName();
  switch (env) {
    case 'QA':
      return TnC.HOSTS.QA;
    case 'DEV':
      return TnC.HOSTS.DEV;
    case 'STAGE':
      return TnC.HOSTS.STAGE;
    default:
      return TnC.HOSTS.PROD;
  }
}

export function getTnCUrl(accountNumber) {
  const wejava_host = getTnCHost();
  const redirectUrl = encodeURIComponent(window.location.href + (accountNumber ? `?partnerAccountNumber=${accountNumber}` : ''));
  const cancelRedirectUrl = encodeURIComponent(window.location.href + `?rejectedTnC=true`);
  return `https://${wejava_host}/wapps/tnc/ackrequired?site=${TnC.SITE_CODE}&event=${TnC.EVENT_CODE}&redirect=${redirectUrl}&cancelRedirect=${cancelRedirectUrl}`;
} 