import React from 'react'
import { createRoot } from 'react-dom/client'
import Page from '../lib/page.tsx'
import '@/styles/application.css'

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    const root = createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <Page />
      </React.StrictMode>
    )
  }
})