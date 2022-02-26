import { EuroMessageApi, VisilabsApi } from "react-native-related-digital";
import { isIphone } from "_utils/helpers";

const APP_ALIAS_IOS = 'costacoffeeios'
const APP_ALIAS_ANDROID = 'costacoffeeandroid'
const SITE_ID = '4874496233646A4F5469493D'
const ORGANIZATION_ID = '6B557846654856304732773D'
const DATA_SOURCE = 'costacoffee'

export const visilabsApi = new VisilabsApi(isIphone() ? APP_ALIAS_IOS : APP_ALIAS_ANDROID, SITE_ID, ORGANIZATION_ID, DATA_SOURCE)
export const euroMessageApi = new EuroMessageApi(isIphone() ? APP_ALIAS_IOS : APP_ALIAS_ANDROID)
