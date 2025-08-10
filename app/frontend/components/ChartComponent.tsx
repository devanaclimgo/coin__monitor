import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-chartkick'
import 'chartkick/chart.js'

interface ApiCurrency {
  symbol: string
  sparklineData: number[]
}

export function ChartComponent() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/currency')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((json: ApiCurrency[]) => {
        const chartData = json.map((item) => ({
          name: item.symbol,
          data: item.sparklineData.reduce((acc: any, price: number, idx: number) => {
            acc[idx] = price
            return acc
          }, {})
        }))
        setData(chartData)
      })
      .catch(err => console.error(err))
  }, [])

  if (!data) return <div>Loading chart...</div>

  return <LineChart data={data} xtitle="Index" ytitle="Price" />
}