import { TARGET_CLOSING_BALANCE_INR } from '../utils/statementLedger'

export { TARGET_CLOSING_BALANCE_INR } from '../utils/statementLedger'

/** Editable account display values for the header balance and the home page. */
export const BANK_NAME = 'HDFC Bank'
export const ACCOUNT_HOLDER_NAME = 'Mohan sai reddy Y'
export const ACCOUNT_TYPE_LABEL = 'Salary account'
export const ACCOUNT_NUMBER_MASKED = '5010XXXXXX3214'

/** Full account number shown on downloadable statement (aligned with PDF layout). */
export const STATEMENT_ACCOUNT_NUMBER_FULL = '50100834595280'
export const STATEMENT_ACCOUNT_TYPE_LINE = 'SAVINGS - RESIDENTS (113)'
export const STATEMENT_CUSTOMER_LEGAL_NAME = 'MR YERRAM PALLI MOHAN SAI REDDY'

export const STATEMENT_ADDRESS_LINES = [
  'DURGA PG - 3RD FLOOR MARATHAHALLI',
  '3RD CROSS PR LAYOUT',
  'NEAR BIRIYANI ZONE',
  'BENGALURU 560037',
  'KARNATAKA INDIA',
]

export const STATEMENT_JOINT_HOLDERS_LINE = 'JOINT HOLDERS :'
export const STATEMENT_JOINT_HOLDERS_VALUE = ''
export const STATEMENT_NOMINATION_LINE = 'Nomination'

/** Issuing branch details (statement header). */
export const STATEMENT_BRANCH_NAME = 'WHITEFIELD - ITPL ROAD'
export const STATEMENT_BRANCH_ADDRESS_LINES = [
  'SURVEY NO 7/1 KATHA NO 418/1 NEAR KUDALAHALLI GATE',
  'BEML LAYOUT BROOKE FIELDS MAIN ROAD ITPL ROAD',
]
export const STATEMENT_BRANCH_CITY = 'BENGALURU 560066'
export const STATEMENT_BRANCH_STATE = 'KARNATAKA'
export const STATEMENT_BRANCH_PHONE = '18002600 / 18001600'
export const STATEMENT_OD_LIMIT = '0.00'
export const STATEMENT_CURRENCY = 'INR'
export const STATEMENT_EMAIL = 'MOHANSAIREDDY062@GMAIL.COM'
export const STATEMENT_CUST_ID = '333586525'
export const STATEMENT_ACCOUNT_OPEN_DATE_DMY = '11/11/2025'
export const STATEMENT_ACCOUNT_STATUS = 'Regular'
export const STATEMENT_IFSC = 'HDFC0001472'
export const STATEMENT_MICR = '560240047'
export const STATEMENT_BRANCH_CODE = '1472'
export const STATEMENT_BANK_TAGLINE = 'We understand your world'

/** Available balance (same as ledger target closing; matches MSG Global NEFT salary demo). */
export const AVAILABLE_BALANCE_INR = TARGET_CLOSING_BALANCE_INR
