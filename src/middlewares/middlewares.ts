import { NextFunction, Request, Response } from 'express'
import { ValidationError } from '../utils/validators'

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
    .then((result) => {
      res.send(result)
    })
    .catch((error) => {
      next(error)
    })
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof ValidationError) {
    res.status(400).send({ error: `${error.message}` })
  } else {
    res.status(500).send({ error: `${error.message}` })
  }
}
