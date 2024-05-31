import axios from 'axios'
import { getSpreadByMarketId, getSpreads } from '../../services/spreadServices'
import * as spreadServices from '../../services/spreadServices'
import * as marketServices from '../../services/marketServices'
import { DUMMY_NUMBER_VALUE, serviceError, VALID_MARKET_ID } from '../constants'

jest.mock('axios')

const mockedApi = axios as jest.Mocked<typeof axios>

describe('spreadServices', () => {
  describe('getSpreadByMarketId', () => {
    it('should return the correct spread for a valid marketId', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          order_book: {
            bids: [[20, 1], [100, 1], [99, 2]], // Highest bid: 100
            asks: [[134, 1], [110, 2], [173, 2]] // Lowest ask: 110
          }
        }
      })

      const spread = await getSpreadByMarketId(VALID_MARKET_ID)

      expect(spread).toEqual(10) // Lowest ask (110) - Highest bid (100)
    })

    it('should return a message if the orderBook is empty', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { order_book: { bids: [], asks: [] } } })

      const spread = await getSpreadByMarketId(VALID_MARKET_ID)

      expect(spread).toEqual('order book is empty')
    })

    it('should return a message if the orderBook does not have bids', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { order_book: { bids: [], asks: [[DUMMY_NUMBER_VALUE, DUMMY_NUMBER_VALUE]] } } })

      const spread = await getSpreadByMarketId(VALID_MARKET_ID)

      expect(spread).toEqual('order book does not have bids')
    })

    it('should return a message if the orderBook does not have asks', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { order_book: { bids: [[DUMMY_NUMBER_VALUE, DUMMY_NUMBER_VALUE]], asks: [] } } })

      const spread = await getSpreadByMarketId(VALID_MARKET_ID)

      expect(spread).toEqual('order book does not have asks')
    })

    it('should handle external API errors', async () => {
      mockedApi.get.mockRejectedValueOnce(serviceError)

      await expect(getSpreadByMarketId(VALID_MARKET_ID)).rejects.toThrow(`Failed to get the spread for ${VALID_MARKET_ID}: ${serviceError.message}`)
    })
  })

  describe('getSpreads', () => {
    const mockedGetMarketIds = jest.spyOn(marketServices, 'getMarketIds')
    const mockedGetSpreadByMarketId = jest.spyOn(spreadServices, 'getSpreadByMarketId')

    it('should return the correct spreads for all markets', async () => {
      const markets = [VALID_MARKET_ID, VALID_MARKET_ID + '_']
      const spreads: { [key: string]: number } = { [VALID_MARKET_ID]: DUMMY_NUMBER_VALUE, [VALID_MARKET_ID + '_']: DUMMY_NUMBER_VALUE + 1 }

      mockedGetMarketIds.mockResolvedValueOnce(markets)
      mockedGetSpreadByMarketId.mockImplementation(async (marketId: string) => {
        return await Promise.resolve(spreads[marketId])
      })

      const result = await getSpreads()

      expect(result).toEqual(spreads)
      expect(mockedGetMarketIds).toHaveBeenCalled()
      expect(mockedGetSpreadByMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
      expect(mockedGetSpreadByMarketId).toHaveBeenCalledWith(VALID_MARKET_ID + '_')
    })

    it('should handle errors from getMarketIds', async () => {
      const mockedGetMarketIds = jest.spyOn(marketServices, 'getMarketIds')
      mockedGetMarketIds.mockRejectedValueOnce(serviceError)

      await expect(getSpreads()).rejects.toThrow(`Failed to get spreads for all markets: ${serviceError.message}`)

      expect(mockedGetMarketIds).toHaveBeenCalled()
    })

    it('should handle errors from getSpreadByMarketId', async () => {
      mockedGetMarketIds.mockResolvedValueOnce([VALID_MARKET_ID])
      mockedGetSpreadByMarketId.mockRejectedValueOnce(serviceError)

      await expect(getSpreads()).rejects.toThrow(`Failed to get spreads for all markets: ${serviceError.message}`)

      expect(mockedGetMarketIds).toHaveBeenCalled()
      expect(mockedGetSpreadByMarketId).toHaveBeenCalledWith(VALID_MARKET_ID)
    })
  })
})
