import { validateIsDefined, validateMarketId, validateIsANumber } from '../../utils/validators'
import { getMarketIds } from '../../services/marketServices'
import {
  FIELD_NAME, MARKET_ID_FIELD_NAME, DUMMY_NUMBER_VALUE, DUMMY_STRING_VALUE, VALID_MARKET_ID, NOT_VALID_MARKET_ID,
  errorIsRequired, errorInvalidMarketId, errorMustBeNumber, errorMustBeString
} from '../constants'

jest.mock('../../services/marketServices')
const mockedGetMarketIds = getMarketIds as jest.MockedFunction<typeof getMarketIds>

describe('validators', () => {
  describe('validateIsDefined', () => {
    it('should throw ValidationError if the value is undefined', () => {
      expect(() => validateIsDefined(FIELD_NAME, undefined)).toThrow(errorIsRequired(FIELD_NAME))
    })

    it('should not throw an error if the value is defined', () => {
      expect(() => validateIsDefined(FIELD_NAME, DUMMY_STRING_VALUE)).not.toThrow()
    })
  })

  describe('validateMarketId', () => {
    it('should throw ValidationError if the value is undefined', async () => {
      await expect(validateMarketId(undefined)).rejects.toThrow(errorIsRequired(MARKET_ID_FIELD_NAME))
    })

    it('should throw ValidationError if the value is not a string', async () => {
      await expect(validateMarketId(123)).rejects.toThrow(errorMustBeString(MARKET_ID_FIELD_NAME))
    })

    it('should throw ValidationError if the value is not a valid marketId', async () => {
      mockedGetMarketIds.mockResolvedValueOnce([VALID_MARKET_ID])
      await expect(validateMarketId(NOT_VALID_MARKET_ID)).rejects.toThrow(errorInvalidMarketId(NOT_VALID_MARKET_ID))
    })

    it('should not throw an error if the value is a valid marketId', async () => {
      mockedGetMarketIds.mockResolvedValueOnce([VALID_MARKET_ID])
      await expect(validateMarketId(VALID_MARKET_ID)).resolves.not.toThrow()
    })
  })

  describe('validateIsANumber', () => {
    it('should throw ValidationError if the value is undefined', () => {
      expect(() => validateIsANumber(FIELD_NAME, undefined)).toThrow(errorIsRequired(FIELD_NAME))
    })

    it('should throw ValidationError if the value is not a number', () => {
      expect(() => validateIsANumber(FIELD_NAME, DUMMY_STRING_VALUE)).toThrow(errorMustBeNumber(FIELD_NAME))
    })

    it('should throw ValidationError if the value is NaN', () => {
      expect(() => validateIsANumber(FIELD_NAME, NaN)).toThrow(errorMustBeNumber(FIELD_NAME))
    })

    it('should not throw an error if the value is a number', () => {
      expect(() => validateIsANumber(FIELD_NAME, DUMMY_NUMBER_VALUE)).not.toThrow()
    })
  })
})
