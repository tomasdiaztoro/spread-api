import axios from 'axios'
import { getMarketIds } from '../../services/marketServices'
import { serviceError, VALID_MARKET_ID } from '../constants'

jest.mock('axios')

const mockedApi = axios as jest.Mocked<typeof axios>

describe('marketServices', () => {
  describe('getMarketIds', () => {
    it('should return market ids when the API call is successful', async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: {
          markets: [
            { name: VALID_MARKET_ID },
            { name: VALID_MARKET_ID + '_' }
          ]
        }
      })

      const marketIds = await getMarketIds()

      expect(marketIds).toEqual([VALID_MARKET_ID, VALID_MARKET_ID + '_'])
    })
    it('should throw an error when the API call fails', async () => {
      mockedApi.get.mockRejectedValueOnce(serviceError)

      await expect(getMarketIds()).rejects.toThrow(`Failed to get market ids: ${serviceError.message}`)
    })
  })
})
