require "net/http"
require "json"

class HomeController < ApplicationController
  CURRENCIES = [
    { code: "USD-BRL", color: "text-green-400" },
    { code: "EUR-BRL", color: "text-blue-400" },
    { code: "BTC-BRL", color: "text-yellow-400" }
  ].freeze

  def index
    @currencies = fetch_currency_data
  end

  private

  def fetch_currency_data
    CURRENCIES.map do |currency|
      url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")
      response = Net::HTTP.get(url)
      data = JSON.parse(response)

      sorted_data = data.sort_by { |entry| entry["timestamp"].to_i }
      prices = sorted_data.map { |entry| entry["high"].to_f }
      latest = sorted_data.last

      {
        code: currency[:code],
        name: currency[:code].gsub("-", " to "),
        price: latest["high"].to_f,
        change24h: latest["pctChange"].to_f,
        sparklineData: prices,
        color: currency[:color]
      }
    end
  end
end
