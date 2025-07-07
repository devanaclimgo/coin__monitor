import { useEffect, useRef } from 'react'
import { createColumnChart } from 'chartkick'

export function ChartComponent() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/home/index.json')
      .then(response => response.json())
      .then(data => {
        if (chartRef.current) {
          createColumnChart(chartRef.current, {
            data: data,
            xtitle: 'Date',
            ytitle: 'Rate',
          })
        }
      })
  }, [])

  return <div ref={chartRef} style={{ height: '500px' }} />
}