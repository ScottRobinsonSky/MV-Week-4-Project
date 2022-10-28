// Get current data from data.js
const currency = require('./currency.json')
const supportedCurrencies =
  [
    "AED",
    "ARS",
    "AUD",
    "BRL",
    "CAD",
    "CHF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "EUR",
    "GBP",
    "HKD",
    "ILS",
    "IDR",
    "INR",
    "JPY",
    "KRW",
    "KWD",
    "KZT",
    "MXN",
    "MYR",
    "NOK",
    "NZD",
    "PEN",
    "PHP",
    "PLN",
    "QAR",
    "RUB",
    "SAR",
    "SGD",
    "THB",
    "TRY",
    "TWD",
    "UAH",
    "USD",
    "UYU",
    "VND",
    "ZAR",
  ]
// Copied from https://github.com/michaelrhodes/currency-code-map
const allCurrencyMap = {
  IE: 'EUR',
  AF: 'AFN',
  AX: 'EUR',
  AL: 'ALL',
  DZ: 'DZD',
  AD: 'EUR',
  AO: 'AOA',
  AI: 'XCD',
  AG: 'XCD',
  AR: 'ARS',
  AM: 'AMD',
  AW: 'AWG',
  AU: 'AUD',
  AT: 'EUR',
  AZ: 'AZN',
  BS: 'BSD',
  BH: 'BHD',
  BD: 'BDT',
  BB: 'BBD',
  BY: 'BYR',
  BE: 'EUR',
  BZ: 'BZD',
  BJ: 'XOF',
  BM: 'BMD',
  BT: 'BTN',
  BO: 'BOB',
  BA: 'BAM',
  BW: 'BWP',
  BR: 'BRL',
  BN: 'BND',
  BG: 'BGN',
  BF: 'XOF',
  BI: 'BIF',
  KH: 'KHR',
  CM: 'XAF',
  CA: 'CAD',
  CV: 'CVE',
  KY: 'KYD',
  CF: 'XAF',
  TD: 'XAF',
  CL: 'CLP',
  CN: 'CNY',
  CX: 'AUD',
  CC: 'AUD',
  CO: 'COP',
  KM: 'KMF',
  CG: 'XAF',
  CD: 'CDF',
  CR: 'CRC',
  CI: 'XOF',
  HR: 'HRK',
  CU: 'CUC',
  CW: 'ANG',
  CY: 'EUR',
  CZ: 'CZK',
  DK: 'DKK',
  DJ: 'DJF',
  DM: 'XCD',
  DO: 'DOP',
  EG: 'EGP',
  GQ: 'XAF',
  ER: 'ERN',
  EE: 'EUR',
  ET: 'ETB',
  FK: 'FKP',
  FO: 'DKK',
  FJ: 'FJD',
  FI: 'EUR',
  FR: 'EUR',
  GF: 'EUR',
  PF: 'XPF',
  TF: 'EUR',
  GA: 'XAF',
  GM: 'GMD',
  GE: 'GEL',
  DE: 'EUR',
  GH: 'GHS',
  GI: 'GIP',
  GR: 'EUR',
  GL: 'DKK',
  GD: 'XCD',
  GP: 'EUR',
  GT: 'GTQ',
  GN: 'GNF',
  GW: 'XOF',
  GY: 'GYD',
  HT: 'HTG',
  HM: 'AUD',
  VA: 'EUR',
  HN: 'HNL',
  HK: 'HKD',
  HU: 'HUF',
  IS: 'ISK',
  IN: 'INR',
  ID: 'IDR',
  IR: 'IRR',
  IQ: 'IQD',
  IL: 'ILS',
  IT: 'EUR',
  JM: 'JMD',
  JP: 'JPY',
  JO: 'JOD',
  KZ: 'KZT',
  KE: 'KES',
  KI: 'AUD',
  KP: 'KPW',
  KR: 'KRW',
  KW: 'KWD',
  KG: 'KGS',
  LA: 'LAK',
  LV: 'LVL',
  LB: 'LBP',
  LS: 'LSL',
  LR: 'LRD',
  LY: 'LYD',
  LT: 'LTL',
  LU: 'EUR',
  MO: 'HKD',
  MK: 'MKD',
  MG: 'MGA',
  MW: 'MWK',
  MY: 'MYR',
  MV: 'MVR',
  ML: 'XOF',
  MT: 'EUR',
  MQ: 'EUR',
  MR: 'MRO',
  MU: 'MUR',
  YT: 'EUR',
  MX: 'MXN',
  MD: 'MDL',
  MC: 'EUR',
  MN: 'MNT',
  ME: 'EUR',
  MS: 'XCD',
  MA: 'MAD',
  MZ: 'MZN',
  MM: 'MMK',
  NA: 'NAD',
  NR: 'AUD',
  NP: 'NPR',
  NL: 'EUR',
  NC: 'XPF',
  NZ: 'NZD',
  NI: 'NIO',
  NE: 'XOF',
  NG: 'NGN',
  NF: 'AUD',
  NO: 'NOK',
  OM: 'OMR',
  PK: 'PKR',
  PS: 'EGP',
  PA: 'PAB',
  PG: 'PGK',
  PY: 'PYG',
  PE: 'PEN',
  PH: 'PHP',
  PL: 'PLN',
  PT: 'EUR',
  QA: 'QAR',
  RE: 'EUR',
  RO: 'RON',
  RU: 'RUB',
  RW: 'RWF',
  BL: 'EUR',
  SH: 'SHP',
  KN: 'XCD',
  LC: 'XCD',
  MF: 'EUR',
  PM: 'CAD',
  VC: 'XCD',
  WS: 'WST',
  SM: 'EUR',
  ST: 'STD',
  SA: 'SAR',
  SN: 'XOF',
  RS: 'RSD',
  SC: 'SCR',
  SL: 'SLL',
  SG: 'SGD',
  SX: 'ANG',
  SK: 'EUR',
  SI: 'EUR',
  SB: 'SBD',
  SO: 'SOS',
  ZA: 'ZAR',
  SS: 'SSP',
  ES: 'EUR',
  LK: 'LKR',
  SD: 'SDG',
  SR: 'SRD',
  SZ: 'SZL',
  SE: 'SEK',
  CH: 'CHF',
  SY: 'SYP',
  TW: 'TWD',
  TJ: 'TJS',
  TZ: 'TZS',
  TH: 'THB',
  TG: 'XOF',
  TO: 'TOP',
  TT: 'TTD',
  TN: 'TND',
  TR: 'TRY',
  TM: 'TMT',
  UG: 'UGX',
  UA: 'UAH',
  AE: 'AED',
  GB: 'GBP',
  US: 'USD',
  UY: 'UYU',
  UZ: 'UZS',
  VU: 'VUV',
  VE: 'VEF',
  VN: 'VND',
  WF: 'XPF',
  EH: 'MAD',
  YE: 'YER',
  ZM: 'ZMW',
}


const currencyList = {}
supportedCurrencies.forEach(currencyCode => {
  // Get country code for the currency
  const countryCode = Object.entries(allCurrencyMap).find(item => {
    if (item[1] == currencyCode) return true
  })

  let symbolText = ''
  
  currencyList[currencyCode] = {
    symbol: currency[currencyCode].symbol,
    countryCode: countryCode[0]
  }
})

console.log(currencyList)