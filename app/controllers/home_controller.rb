require "net/http"
require "json"

class HomeController < ApplicationController
  CURRENCIES = [
    { code: "USD-BRL", color: "text-green-400" },
    { code: "EUR-BRL", color: "text-blue-400" },
    { code: "BTC-BRL", color: "text-yellow-400" }
  ].freeze

  def index
    @currencies = CURRENCIES.map do |currency|
      fetch_currency_data(currency)
    end.compact
  end

  private

  def fetch_currency_data(currency)
    url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")

    begin
      response = Net::HTTP.get(url)
      data = JSON.parse(response)

      latest = data.max_by { |entry| entry["timestamp"].to_i }

      {
        code: currency[:code],
        name: currency[:code].tr("-", " to "),
        price: latest["high"].to_f,
        change24h: latest["pctChange"].to_f,
        color: currency[:color]
      }
    rescue StandardError => e
      Rails.logger.error "Erro ao buscar #{currency[:code]}: #{e.message}"
      nil
    end
  end
end
