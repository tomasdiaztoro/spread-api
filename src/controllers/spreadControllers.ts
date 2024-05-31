import { Request, Response, NextFunction } from 'express'
import { getSpreadByMarketId, getSpreads } from '../services/spreadServices'
import { validateMarketId } from '../utils/validators'

export const getSpreadByMarketIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const marketId = req.params.marketId

  try {
    await validateMarketId(marketId)
    const spreadResponse = await getSpreadByMarketId(marketId)
    res.json({ marketId, value: spreadResponse })
  } catch (error) {
    next(error)
  }
}

export const getSpreadsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const spreads = await getSpreads()
    const spreadsResponse = Object.entries(spreads).map(([marketId, value]) => {
      return { marketId, value }
    })
    res.json(spreadsResponse)
  } catch (error) {
    next(error)
  }
}
