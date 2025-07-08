import { ColumnChart } from 'chartkick'
import 'chartkick/chart.js'
import { useState, useEffect } from 'react'

export function ChartComponent() {
  const [data, setData] = useState({})

  useEffect(() => {
    fetch('/home/index.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <ColumnChart data={data} xtitle="Date" ytitle="Rate" height="500px" />
}