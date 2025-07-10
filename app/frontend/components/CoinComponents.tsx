"use client"

import { useState, useEffect } from "react"
import { Search, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

fetch("/app/controllers/api/currency_controller.rb")

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
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Mock data - in a real app, this would come from an API like CoinGecko
  const mockCoins: Coin[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      current_price: 43250.67,
      price_change_percentage_24h: 2.45,
      market_cap: 847500000000,
      volume_24h: 15200000000,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      current_price: 2580.34,
      price_change_percentage_24h: -1.23,
      market_cap: 310200000000,
      volume_24h: 8900000000,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "binancecoin",
      name: "BNB",
      symbol: "BNB",
      current_price: 315.78,
      price_change_percentage_24h: 0.87,
      market_cap: 47300000000,
      volume_24h: 1200000000,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      current_price: 98.45,
      price_change_percentage_24h: 5.67,
      market_cap: 43800000000,
      volume_24h: 2100000000,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      current_price: 0.485,
      price_change_percentage_24h: -2.14,
      market_cap: 17200000000,
      volume_24h: 450000000,
      image: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "avalanche",
      name: "Avalanche",
      symbol: "AVAX",
      current_price: 36.78,
      price_change_percentage_24h: 3.21,
      market_cap: 14500000000,
      volume_24h: 680000000,
      image: "/placeholder.svg?height=32&width=32",
    },
  ]

  const fetchCoins = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add some random price fluctuation to simulate real-time updates
    const updatedCoins = mockCoins.map((coin) => ({
      ...coin,
      current_price: coin.current_price * (1 + (Math.random() - 0.5) * 0.02),
      price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() - 0.5) * 2,
    }))

    setCoins(updatedCoins)
    setFilteredCoins(updatedCoins)
    setLastUpdated(new Date())
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
    if (price < 1) {
      return `$${price.toFixed(4)}`
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toLocaleString()}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    }
    return `$${volume.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Crypto Monitor</h1>
          <p className="text-slate-600">Real-time cryptocurrency price tracking</p>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <Button onClick={fetchCoins} disabled={isLoading} variant="outline" size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coins Grid - Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:hidden">
          {filteredCoins.map((coin) => (
            <Card key={coin.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <CardTitle className="text-lg">{coin.name}</CardTitle>
                      <p className="text-sm text-slate-600 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <Badge
                    variant={coin.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatPrice(coin.current_price)}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-600">Market Cap:</span>
                    <div className="font-medium">{formatMarketCap(coin.market_cap)}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Volume 24h:</span>
                    <div className="font-medium">{formatVolume(coin.volume_24h)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coins Table - Desktop */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Volume (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoins.map((coin, index) => (
                  <TableRow key={coin.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-slate-600 uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(coin.current_price)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={coin.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                        className="flex items-center gap-1 justify-end w-fit ml-auto"
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatMarketCap(coin.market_cap)}</TableCell>
                    <TableCell className="text-right">{formatVolume(coin.volume_24h)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredCoins.length === 0 && searchTerm && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">No coins found matching "{searchTerm}"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
