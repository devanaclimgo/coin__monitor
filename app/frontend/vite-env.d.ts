/// <reference types="vite/client" />

declare global {
  interface Window {
    crypto: Crypto
  }
}