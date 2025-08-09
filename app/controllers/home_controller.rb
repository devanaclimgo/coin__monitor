require "net/http"
require "json"

class HomeController < ApplicationController
  CURRENCIES = [
    { code: "USD-BRL" },
    { code: "EUR-BRL" },
    { code: "BTC-BRL" }
  ]

  def index
    @chart_data = []

    CURRENCIES.each do |currency|
      url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")
      response = Net::HTTP.get(url)
      data = JSON.parse(response)

      @chart_data << {
        name: currency[:code],
        data: data.each_with_object({}) do |entry, hash|
          date = Time.at(entry["timestamp"].to_i).strftime("%d/%m/%y")
          hash[date] = entry["high"].to_f
        end
      }
    end
    puts @chart_data.inspect
  end
end
