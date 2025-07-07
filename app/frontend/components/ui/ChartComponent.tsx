import { useEffect, useState } from 'react'
import { ColumnChart } from 'chartkick'
import 'chartkick/chart.js'

export function ChartComponent() {
  const [chartData, setChartData] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/home/index.json')
      .then(response => response.json())
      .then(setChartData)
  }, [])

  return (
    <ColumnChart 
      data={chartData} 
      xtitle="Date" 
      ytitle="Rate" 
      height="500px"
    />
  )
}