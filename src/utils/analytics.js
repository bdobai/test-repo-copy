import { EuroMessageApi, VisilabsApi } from "react-native-related-digital";

const APP_ALIAS = 'appAlias'
const SITE_ID = 'siteId'
const ORGANIZATION_ID = 'organizationId'
const DATA_SOURCE = 'dataSource'

export const visilabsApi = new VisilabsApi(APP_ALIAS, SITE_ID, ORGANIZATION_ID, DATA_SOURCE)
export const euroMessageApi = new EuroMessageApi(APP_ALIAS)
