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

    # If no data was fetched successfully, provide fallback data
    if @currencies.empty?
      Rails.logger.warn "No currency data fetched for home page, providing fallback data"
      @currencies = CURRENCIES.map do |currency|
        {
          code: currency[:code],
          name: currency[:code].tr("-", " to "),
          price: 0.0,
          change24h: 0.0,
          color: currency[:color]
        }
      end
    end
  end

  def health
    render json: {
      status: "ok",
      timestamp: Time.current,
      environment: Rails.env,
      database: ActiveRecord::Base.connection.active? ? "connected" : "disconnected"
    }
  end

  def test_external_api
    require "net/http"
    require "json"

    begin
      url = URI("https://economia.awesomeapi.com.br/json/daily/USD-BRL/1")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.open_timeout = 10
      http.read_timeout = 10

      request = Net::HTTP::Get.new(url)
      request["User-Agent"] = "CoinMonitor/1.0 (https://coin-monitor.onrender.com)"
      response = http.request(request)

      render json: {
        status: "test_completed",
        response_code: response.code,
        response_body_length: response.body.length,
        response_headers: response.to_hash,
        success: response.code == "200"
      }
    rescue => e
      render json: {
        status: "test_failed",
        error: e.message,
        backtrace: e.backtrace.first(5)
      }
    end
  end

  private

  def fetch_currency_data(currency)
    url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")

    begin
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
        return nil
      end

      Rails.logger.info "Successfully fetched data for #{currency[:code]}: #{response.body.length} bytes"

      data = JSON.parse(response.body)

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
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join(', ')}"
      nil
    end
  end
end
