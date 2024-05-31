import axios from 'axios'
import { Market, OrderBookResponse, OrderBook } from './interfaces'
import { BASE_URL } from './constants'
import { getMarketIds } from './marketServices'

export const getSpreadByMarketId = async (marketId: string): Promise<number | string> => {
  let spread: number | string = 0

  try {
    const response = await axios.get<OrderBookResponse>(`${BASE_URL}/markets/${marketId}/order_book`)
    const orderBook: OrderBook = response.data.order_book
    const bidsLength = orderBook.bids.length
    const asksLength = orderBook.asks.length

    if (bidsLength > 0 && asksLength > 0) {
      const sortedBids = orderBook.bids.map(bid => bid.map(value => parseFloat(value))).sort((a, b) => b[0] - a[0])
      const sortedAsks = orderBook.asks.map(ask => ask.map(value => parseFloat(value))).sort((a, b) => a[0] - b[0])
      const highestBid: number = sortedBids[0][0]
      const lowestAsk: number = sortedAsks[0][0]
      spread = lowestAsk - highestBid
    } else if (bidsLength === 0 && asksLength === 0) {
      spread = 'order book is empty'
    } else if (bidsLength === 0) {
      spread = 'order book does not have bids'
    } else if (asksLength === 0) {
      spread = 'order book does not have asks'
    }

    return spread
  } catch (error) {
    throw new Error(`Failed to get the spread for ${marketId}: ${(error as Error).message}`)
  }
}

export const getSpreads = async (): Promise<Record<Market['name'], number | string>> => {
  try {
    const markets = await getMarketIds()
    const maps: Record<Market['name'], number | string> = {}

    await Promise.all(markets.map(async (marketId) => {
      maps[marketId] = await getSpreadByMarketId(marketId)
    }))

    return maps
  } catch (error) {
    throw new Error(`Failed to get spreads for all markets: ${(error as Error).message}`)
  }
}
