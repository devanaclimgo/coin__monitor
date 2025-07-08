import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CurrencyData } from '@/types'

export default function CurrencyCard({
  currency,
  isDark,
  onClick,
}: {
  currency: CurrencyData
  isDark: boolean
  onClick: () => void
}) {
  const isPositive = currency.change24h >= 0

  return (
    <Card className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
      ${isDark ? "bg-black/20 border-white/10 hover:bg-black/30" : "bg-white/20 border-black/10 hover:bg-white/30"}
      backdrop-blur-xl border`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
      <CardContent className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{currency.name}</h3>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{currency.symbol}</p>
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(currency.change24h).toFixed(2)}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {currency.symbol.includes("BTC") ? `$${currency.price.toLocaleString()}` : `R$ ${currency.price.toFixed(4)}`}
          </div>
          <div className="h-8">
            {/* Sparkline would go here */}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="h-3 w-3" />
          Live Data
        </div>
      </CardContent>
    </Card>
  )
}