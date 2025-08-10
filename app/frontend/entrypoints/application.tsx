import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/application.css'
import App from '../components/App'

const el = document.getElementById('root')!
const root = ReactDOM.createRoot(el)
root.render(<App />)