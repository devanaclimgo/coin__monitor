require "net/http"
require "json"

class Api::CurrencyController < ApplicationController
  CURRENCIES = [
    { code: "USD-BRL", color: "#22c55e" },
    { code: "EUR-BRL", color: "#3b82f6" },
    { code: "BTC-BRL", color: "#f59e0b" }
  ]

    def index
    require "net/http"
    require "json"

    Rails.logger.info "Starting currency API request for #{CURRENCIES.length} currencies"

    chart_data = CURRENCIES.map do |currency|
      begin
        url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")

        # Add timeout and better error handling
        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.open_timeout = 10
        http.read_timeout = 10

        request = Net::HTTP::Get.new(url)
        request["User-Agent"] = "CoinMonitor/1.0 (https://coin-monitor.onrender.com)"
        response = http.request(request)

        if response.code != "200"
          Rails.logger.error "API returned #{response.code} for #{currency[:code]}: #{response.body}"
          Rails.logger.error "Response headers: #{response.to_hash}"
          next
        end

        Rails.logger.info "Successfully fetched data for #{currency[:code]}: #{response.body.length} bytes"

        data = JSON.parse(response.body)

        sorted_data = data.sort_by { |entry| entry["timestamp"].to_i }

        sparkline = sorted_data.map { |entry| entry["high"].to_f }
        latest = sorted_data.last

        {
          symbol: currency[:code],
          name: currency[:code].gsub("-", " to "),
          price: latest["high"].to_f,
          change24h: latest["pctChange"].to_f,
          sparklineData: sparkline,
          color: currency[:color]
        }
      rescue StandardError => e
        Rails.logger.error "Error fetching #{currency[:code]}: #{e.message}"
        Rails.logger.error "Backtrace: #{e.backtrace.first(5).join(', ')}"
        nil
      end
    end.compact

    # If no data was fetched successfully, provide fallback data
    if chart_data.empty?
      Rails.logger.warn "No currency data fetched, providing fallback data"
      chart_data = CURRENCIES.map do |currency|
        {
          symbol: currency[:code],
          name: currency[:code].gsub("-", " to "),
          price: 0.0,
          change24h: 0.0,
          sparklineData: Array.new(15, 0.0),
          color: currency[:color]
        }
      end
    end

    render json: chart_data
    end
end
