export interface CurrencyData {
  symbol: string
  name: string
  price: number
  change24h: number
  sparklineData: number[]
  color: string
}

export interface Coin {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
  image: string
}