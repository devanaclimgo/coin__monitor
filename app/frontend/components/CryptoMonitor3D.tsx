"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Moon, Sun, Activity } from "lucide-react"
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import Background3D from "./threejs/Background3D"
import { CurrencyData } from "../types"

fetch("/app/controllers/api/currency_controller.rb")

export default function CryptoMonitor3D() {
  const [isDark, setIsDark] = useState(true)
  const [currencies, setCurrencies] = useState<CurrencyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/currency_data')
      .then(res => res.json())
      .then(data => {
        setCurrencies(data)
        setLoading(false)
      })
      .catch(() => {
        // Fallback mock data if API fails
        setCurrencies([
          {
            symbol: "BTC/USD",
            name: "Bitcoin",
            price: 43250.67,
            change24h: 2.45,
            sparklineData: [42800, 43100, 42950, 43200, 43400, 43150, 43250],
            color: "#f7931a",
          },
          {
            symbol: "EUR/BRL",
            name: "Euro to Real",
            price: 5.4321,
            change24h: -0.87,
            sparklineData: [5.45, 5.44, 5.43, 5.42, 5.44, 5.43, 5.43],
            color: "#0066cc",
          },
          {
            symbol: "USD/BRL",
            name: "Dollar to Real",
            price: 4.9876,
            change24h: 1.23,
            sparklineData: [4.95, 4.97, 4.99, 4.98, 4.99, 4.98, 4.99],
            color: "#00cc66",
          },
        ])
        setLoading(false)
      })
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        price: currency.price * (1 + (Math.random() - 0.5) * 0.005),
        change24h: currency.change24h + (Math.random() - 0.5) * 0.2
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCardClick = (currency: CurrencyData) => {
    console.log(`Selected ${currency.name}`)
    // Add your interaction logic here
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black" 
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    }`}>
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Background3D />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CryptoVault 3D
              </h1>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Real-time currency monitoring in 3D space
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className={`${
                isDark
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  : "bg-black/10 border-black/20 text-black hover:bg-black/20"
              } backdrop-blur-xl`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="text-center py-12">
              <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>Loading currencies...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Currency Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currencies.map(currency => (
                  <Card
                    key={currency.symbol}
                    className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
                      ${isDark ? "bg-black/20 border-white/10 hover:bg-black/30" : "bg-white/20 border-black/10 hover:bg-white/30"}
                      backdrop-blur-xl border`}
                    onClick={() => handleCardClick(currency)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
                    <CardContent className="relative p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                            {currency.name}
                          </h3>
                          <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {currency.symbol}
                          </p>
                        </div>
                        <Badge
                          variant={currency.change24h >= 0 ? "default" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          {currency.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(currency.change24h).toFixed(2)}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {currency.symbol.includes("BTC")
                            ? `$${currency.price.toLocaleString()}`
                            : `R$ ${currency.price.toFixed(4)}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Activity className="h-3 w-3" />
                        Live Data
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Stats Summary */}
              <div className="mt-12">
                <Card className={`max-w-4xl mx-auto ${
                  isDark ? "bg-black/20 border-white/10" : "bg-white/20 border-black/10"
                } backdrop-blur-xl border`}>
                  <CardContent className="p-6">
                    <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                      Market Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currencies.map(currency => (
                        <div key={currency.symbol} className="text-center">
                          <div className={`text-2xl font-bold ${
                            currency.change24h >= 0 
                              ? isDark ? "text-green-400" : "text-green-600"
                              : isDark ? "text-red-400" : "text-red-600"
                          }`}>
                            {currency.symbol.includes("BTC") ? "$" : "R$ "}
                            {currency.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: currency.symbol.includes("BTC") ? 2 : 4
                            })}
                          </div>
                          <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {currency.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}