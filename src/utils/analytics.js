import { EuroMessageApi, VisilabsApi } from "react-native-related-digital";

const APP_ALIAS = 'costacoffee'
const SITE_ID = '4874496233646A4F5469493D'
const ORGANIZATION_ID = '6B557846654856304732773D'
const DATA_SOURCE = 'costacoffee'

export const visilabsApi = new VisilabsApi(APP_ALIAS, SITE_ID, ORGANIZATION_ID, DATA_SOURCE)
export const euroMessageApi = new EuroMessageApi(APP_ALIAS)
