export const FIELD_NAME = 'dummyField'
export const MARKET_ID_FIELD_NAME = 'marketId'
export const VALID_MARKET_ID = 'dummyId'
export const NOT_VALID_MARKET_ID = 'fakeId'
export const DUMMY_STRING_VALUE = 'dummyValue'
export const DUMMY_NUMBER_VALUE = 20

export const dummyAlert = { createdAt: new Date('2024-01-01'), value: DUMMY_NUMBER_VALUE, marketId: VALID_MARKET_ID }
export const serviceError = new Error('Service error')
export const errorIsRequired = (field: string): Error => new Error(`${field} is required`)
export const errorMustBeString = (field: string): Error => new Error(`${field} must be a string`)
export const errorMustBeNumber = (field: string): Error => new Error(`${field} must be a number`)
export const errorInvalidMarketId = (marketId: string): Error => new Error(`${marketId} is not a valid marketId`)
