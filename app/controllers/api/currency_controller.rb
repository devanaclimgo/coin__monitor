class Api::CurrencyController < ApplicationController
  CURRENCIES = [
    { code: "USD-BRL", color: "#22c55e" }, # green
    { code: "EUR-BRL", color: "#3b82f6" }, # blue
    { code: "BTC-BRL", color: "#f59e0b" }  # orange
  ]

  def index
    chart_data = CURRENCIES.map do |currency|
      url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")
      response = Net::HTTP.get(url)
      data = JSON.parse(response)

      sorted_data = data.sort_by { |entry| entry["timestamp"].to_i }

      sparkline = sorted_data.map { |entry| entry["high"].to_f }
      latest = sorted_data.last
      previous = sorted_data[-2]

      {
        symbol: currency[:code],
        name: currency[:code].gsub("-", " to "),
        price: latest["high"].to_f,
        change24h: latest["pctChange"].to_f,
        sparklineData: sparkline,
        color: currency[:color]
      }
    end

    render json: chart_data
  end
end
