import React from "react"
import ReactDOM from "react-dom/client"
import "../styles/application.css"
import CryptoMonitor from "../components/CryptoMonitor"

const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <CryptoMonitor />
    </React.StrictMode>
  )
} else {
  console.error("❌ Could not find root element to mount React app")
}