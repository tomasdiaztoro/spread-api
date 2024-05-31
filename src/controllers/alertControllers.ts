import { Request, Response, NextFunction } from 'express'
import { Alert } from './interfaces'
import { validateIsANumber, validateMarketId } from '../utils/validators'

export let alerts: Alert[] = []
export const createAlertController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { value, marketId } = req.body

  try {
    await validateMarketId(marketId)
    validateIsANumber('value', value)

    const alert: Alert = {
      createdAt: new Date(),
      value: value as number,
      marketId: marketId as string
    }

    alerts = alerts.filter(a => a.marketId !== marketId)
    alerts.push(alert)
    res.status(201).send(alert)
  } catch (error) {
    next(error)
  }
}

export const findAlert = (marketId: string): Alert | undefined => {
  return alerts.find(a => a.marketId === marketId)
}

export const getAlertsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const marketId = req.params.marketId
  const spread = req.query?.spread ?? undefined

  try {
    await validateMarketId(marketId)
    const alert: Alert | undefined = findAlert(marketId)

    if (alert === undefined) {
      res.status(404).send({ error: `Alert not found for ${marketId} market` })
      return
    }

    const response: Alert = { ...alert }

    if (spread !== undefined && String(spread) !== '') {
      const spreadNumber = Number(spread)
      validateIsANumber('spread', spreadNumber)
      const spreadStatus: string = spreadNumber >= alert.value ? 'greater or equal' : 'lower'
      response.observation = `Spread ${String(spread)} is ${spreadStatus} than the current alert value`
    }

    res.status(200).send(response)
  } catch (error) {
    next(error)
  }
}
