import { Request, Response, NextFunction } from 'express'
import { findAlert, alerts, getAlertsController, createAlertController } from '../../controllers/alertControllers'
import { validateMarketId, validateIsANumber } from '../../utils/validators'
import { DUMMY_NUMBER_VALUE, VALID_MARKET_ID, NOT_VALID_MARKET_ID, DUMMY_STRING_VALUE, dummyAlert, errorInvalidMarketId, errorMustBeNumber } from '../constants'

jest.mock('../../utils/validators')
jest.mock('../../services/spreadServices')

const mockedValidateMarketId = validateMarketId as jest.MockedFunction<typeof validateMarketId>
const mockedValidateIsANumber = validateIsANumber as jest.MockedFunction<typeof validateIsANumber>

describe('alertController', () => {
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
    alerts.length = 0
  })

  describe('findAlert', () => {
    beforeEach(() => {
      alerts.push(dummyAlert)
    })

    it('should return the correct alert for a valid marketId', () => {
      const result = findAlert(VALID_MARKET_ID)

      expect(result).toEqual(dummyAlert)
    })

    it('should return undefined for an invalid marketId', () => {
      const result = findAlert(NOT_VALID_MARKET_ID)
      expect(result).toBeUndefined()
    })
  })

  describe('createAlertController', () => {
    it('should create an alert successfully', async () => {
      req.body = { marketId: VALID_MARKET_ID, value: DUMMY_NUMBER_VALUE }
      mockedValidateMarketId.mockResolvedValueOnce()
      const mockDate = new Date()
      jest.spyOn(global, 'Date').mockImplementationOnce(() => mockDate as unknown as Date)

      await createAlertController(req as Request, res as Response, next)

      expect(mockedValidateMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(mockedValidateIsANumber).toHaveBeenCalledWith('value', DUMMY_NUMBER_VALUE)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        marketId: VALID_MARKET_ID,
        value: DUMMY_NUMBER_VALUE,
        createdAt: mockDate
      }))
    })

    it('should call next with an error if validateMarketId throws an error', async () => {
      req.body = { marketId: NOT_VALID_MARKET_ID, value: DUMMY_NUMBER_VALUE }
      mockedValidateMarketId.mockRejectedValueOnce(errorInvalidMarketId(NOT_VALID_MARKET_ID))

      await createAlertController(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(errorInvalidMarketId(NOT_VALID_MARKET_ID))
    })

    it('should call next with an error if validateIsANumber throws an error', async () => {
      req.body = { marketId: VALID_MARKET_ID, value: DUMMY_STRING_VALUE }
      mockedValidateMarketId.mockResolvedValueOnce()

      await createAlertController(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(errorMustBeNumber('value'))
    })
  })

  describe('getAlertsController', () => {
    it('should return 404 if no alert is found', async () => {
      req.params = { marketId: NOT_VALID_MARKET_ID }
      mockedValidateMarketId.mockResolvedValueOnce()
      alerts.push(dummyAlert)

      await getAlertsController(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith({ error: `Alert not found for ${NOT_VALID_MARKET_ID} market` })
    })

    it('should return the alert if it is found', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      mockedValidateMarketId.mockResolvedValueOnce()
      alerts.push(dummyAlert)

      await getAlertsController(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith(dummyAlert)
    })

    it('should add an observation if higher spread is provided', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      req.query = { spread: (DUMMY_NUMBER_VALUE + 1).toString() }
      mockedValidateMarketId.mockResolvedValueOnce()
      alerts.push(dummyAlert)

      await getAlertsController(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        ...dummyAlert,
        observation: `Spread ${DUMMY_NUMBER_VALUE + 1} is greater or equal than the current alert value`
      })
    })

    it('should add an observation if lower spread is provided', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      req.query = { spread: '0' }
      mockedValidateMarketId.mockResolvedValueOnce()
      alerts.push(dummyAlert)

      await getAlertsController(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        ...dummyAlert,
        observation: 'Spread 0 is lower than the current alert value'
      })
    })

    it('should call next with an error if validateMarketId throws an error', async () => {
      req.query = { marketId: NOT_VALID_MARKET_ID }
      mockedValidateMarketId.mockRejectedValueOnce(errorInvalidMarketId(NOT_VALID_MARKET_ID))

      await getAlertsController(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(errorInvalidMarketId(NOT_VALID_MARKET_ID))
    })

    it('should call next with an error if validateIsANumber throws an error', async () => {
      req.params = { marketId: VALID_MARKET_ID }
      req.query = { spread: DUMMY_STRING_VALUE }
      mockedValidateMarketId.mockResolvedValueOnce()
      alerts.push(dummyAlert)

      await getAlertsController(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(errorMustBeNumber('spread'))
    })
  })
})
