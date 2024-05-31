import { asyncHandler, errorHandler } from '../../middlewares/middlewares'
import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../../utils/validators'
import { serviceError } from '../constants'

describe('Middlewares', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('asyncHandler', () => {
    it('should call res.send with the result of the handler function when it resolves', async () => {
      const mockHandler = jest.fn().mockResolvedValueOnce('Success')
      const wrappedHandler = asyncHandler(mockHandler)

      await wrappedHandler(req as Request, res as Response, next)

      expect(res.send).toHaveBeenCalledWith('Success')
    })

    it('should call next with the error when the handler function throws an error', async () => {
      const asyncFunction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        next(serviceError)
      }

      const middleware = asyncHandler(asyncFunction)
      await middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(serviceError)
    })
  })

  describe('errorHandler', () => {
    it('should send a 400 response for ValidationError', () => {
      errorHandler(new ValidationError(), req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('should send a 500 response for other errors', () => {
      errorHandler(new Error(), req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
