class Api::CurrencyController < ApplicationController
  def index
    currencies = [
      { code: "USD-BRL", name: "US Dollar", symbol: "$" },
      { code: "EUR-BRL", name: "Euro", symbol: "€" },
      { code: "BTC-BRL", name: "Bitcoin", symbol: "₿" }
    ]

    @chart_data = currencies.map do |currency|
      url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")
      response = Net::HTTP.get(url)
      api_data = JSON.parse(response)

      {
        name: currency[:name],
        symbol: currency[:symbol],
        price: api_data.first["high"].to_f,
        change24h: api_data.first["pctChange"].to_f,
        sparklineData: api_data.map { |d| d["high"].to_f }.reverse,
        color: currency[:code] == "BTC-BRL" ? "#f7931a" : "#3b82f6"
      }
    end

    render json: @chart_data
  end
end
