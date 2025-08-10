'use client'

import { useState, useEffect } from 'react'
import { Search, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Coin {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
  image: string
}

export default function Component() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchCoins = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/currency')
      const json = await res.json()
      // Adapt API to this component's expected fields
      const adapted = json.map((item: any) => ({
        id: item.symbol,
        name: item.name,
        symbol: item.symbol.split('-')[0],
        current_price: item.price,
        price_change_percentage_24h: item.change24h,
        market_cap: 0, // Not provided by API — set 0 or fetch elsewhere
        volume_24h: 0,
        image: '/placeholder.svg',
      }))
      setCoins(adapted)
      setFilteredCoins(adapted)
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCoins()
  }, [])

  useEffect(() => {
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCoins(filtered)
  }, [searchTerm, coins])
  const formatPrice = (price: number) => {
    return price >= 1 ? `$${price.toLocaleString()}` : `R$ ${price.toFixed(4)}`
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(2)}B`
    if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(2)}M`
    if (cap >= 1_000) return `$${(cap / 1_000).toFixed(2)}K`
    return `$${cap}`
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000_000) return `$${(vol / 1_000_000_000).toFixed(2)}B`
    if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(2)}M`
    if (vol >= 1_000) return `$${(vol / 1_000).toFixed(2)}K`
    return `$${vol}`
  }

  return (
    <Card className="w-full bg-white/20 border-black/10 backdrop-blur-xl">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-bold">
            Cryptocurrency Prices
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchCoins}
            disabled={isLoading}
            className={isLoading ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-xs text-gray-500 ml-auto">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
