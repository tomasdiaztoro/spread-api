import { Request, Response, NextFunction } from 'express'
import { getSpreadByMarketIdController, getSpreadsController } from '../../controllers/spreadControllers'
import { validateMarketId, validateIsANumber } from '../../utils/validators'
import { getSpreadByMarketId, getSpreads } from '../../services/spreadServices'
import { DUMMY_NUMBER_VALUE, VALID_MARKET_ID, NOT_VALID_MARKET_ID, serviceError, errorInvalidMarketId, errorMustBeNumber } from '../constants'

jest.mock('../../utils/validators')
jest.mock('../../services/spreadServices')

const mockedValidateMarketId = validateMarketId as jest.MockedFunction<typeof validateMarketId>
const mockedValidateIsANumber = validateIsANumber as jest.MockedFunction<typeof validateIsANumber>
const mockedGetSpreadByMarketId = getSpreadByMarketId as jest.MockedFunction<typeof getSpreadByMarketId>
const mockedGetSpreads = getSpreads as jest.MockedFunction<typeof getSpreads>

describe('Controllers', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { params: {} }
    res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() }
    next = jest.fn()

    mockedValidateIsANumber.mockImplementationOnce((field, value) => {
      if (typeof value !== 'number' || isNaN(value)) {
        throw errorMustBeNumber(field)
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getSpreadByMarketIdController', () => {
    it('should return the spread for a valid marketId', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      mockedValidateMarketId.mockResolvedValueOnce()
      mockedGetSpreadByMarketId.mockResolvedValueOnce(DUMMY_NUMBER_VALUE)

      await getSpreadByMarketIdController(req as Request, res as Response, next)

      expect(mockedValidateMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(mockedGetSpreadByMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(res.json).toHaveBeenCalledWith({ marketId: VALID_MARKET_ID, value: DUMMY_NUMBER_VALUE })
    })

    it('should call next with a ValidationError if marketId is not valid', async () => {
      req.params = { marketId: NOT_VALID_MARKET_ID }
      mockedValidateMarketId.mockRejectedValueOnce(errorInvalidMarketId(NOT_VALID_MARKET_ID))

      await getSpreadByMarketIdController(req as Request, res as Response, next)

      expect(mockedValidateMarketId).toHaveBeenCalledWith(NOT_VALID_MARKET_ID)
      expect(next).toHaveBeenCalledWith(errorInvalidMarketId(NOT_VALID_MARKET_ID))
    })

    it('should call next with an error if getSpreadByMarketId throws an error', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      mockedValidateMarketId.mockResolvedValueOnce()
      mockedGetSpreadByMarketId.mockRejectedValueOnce(serviceError)

      await getSpreadByMarketIdController(req as Request, res as Response, next)

      expect(mockedValidateMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(mockedGetSpreadByMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(next).toHaveBeenCalledWith(serviceError)
    })
  })

  describe('getSpreadsController', () => {
    it('should return spreads successfully', async () => {
      mockedGetSpreads.mockResolvedValueOnce({ [VALID_MARKET_ID]: DUMMY_NUMBER_VALUE })

      await getSpreadsController(req as Request, res as Response, next)

      expect(mockedGetSpreads).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith([
        { marketId: VALID_MARKET_ID, value: DUMMY_NUMBER_VALUE }
      ])
    })

    it('should call next with an error if getSpreads throws an error', async () => {
      mockedGetSpreads.mockRejectedValueOnce(serviceError)

      await getSpreadsController(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(serviceError)
    })
  })
})
