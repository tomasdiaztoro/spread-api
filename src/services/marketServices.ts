import axios from 'axios'
import { BASE_URL } from './constants'
import { MarketsResponse } from './interfaces'

export const getMarketIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get<MarketsResponse>(`${BASE_URL}/markets`)
    return response.data.markets.map(market => market.name)
  } catch (error) {
    throw new Error(`Failed to get market ids: ${(error as Error).message}`)
  }
}
