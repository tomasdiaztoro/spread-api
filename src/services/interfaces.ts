export interface OrderBook {
  asks: string[][]
  bids: string[][]
}

export interface OrderBookResponse {
  order_book: OrderBook
}

export interface Market {
  id: string
  name: string
}

export interface MarketsResponse {
  markets: Market[]
}
