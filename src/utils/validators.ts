import { getMarketIds } from '../services/marketServices'

export class ValidationError extends Error {
  constructor (message?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validateIsDefined = (valueName: any, value: any): void => {
  if (value === undefined) {
    throw new ValidationError(`${valueName as string} is required`)
  }
}

export const validateMarketId = async (value: any): Promise<void> => {
  validateIsDefined('marketId', value)

  if (typeof value !== 'string') {
    throw new ValidationError('marketId must be a string')
  }

  const marketIds = await getMarketIds()

  if (!(marketIds.includes(value))) {
    throw new ValidationError(`${value} is not a valid marketId`)
  }
}

export const validateIsANumber = (valueName: any, value: any): void => {
  validateIsDefined(valueName, value)
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${valueName as string} must be a number`)
  }
}
