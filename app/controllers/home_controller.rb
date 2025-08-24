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

  def debug
    @environment = Rails.env
    @timestamp = Time.current
    
    # Test external API
    begin
      url = URI("https://economia.awesomeapi.com.br/json/daily/USD-BRL/1")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.open_timeout = 10
      http.read_timeout = 10
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      request = Net::HTTP::Get.new(url)
      request["User-Agent"] = "CoinMonitor/1.0 (https://coin-monitor.onrender.com)"
      
      start_time = Time.current
      response = http.request(request)
      end_time = Time.current
      
      @api_test = {
        success: response.code == "200",
        response_code: response.code,
        response_time: (end_time - start_time).round(2),
        response_length: response.body.length,
        response_preview: response.body[0..200]
      }
    rescue => e
      @api_test = {
        success: false,
        error: e.message,
        error_class: e.class
      }
    end
  end

  private

  def fetch_currency_data(currency)
    url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")

    begin
      Rails.logger.info "Fetching data for #{currency[:code]} from #{url}"

      # Add timeout and better error handling
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.open_timeout = 15  # Increased timeout
      http.read_timeout = 15  # Increased timeout
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE  # Temporarily disable SSL verification for debugging

      request = Net::HTTP::Get.new(url)
      request["User-Agent"] = "CoinMonitor/1.0 (https://coin-monitor.onrender.com)"
      request["Accept"] = "application/json"
      request["Accept-Encoding"] = "gzip, deflate"

      Rails.logger.info "Making request to #{url} with User-Agent: #{request['User-Agent']}"

      start_time = Time.current
      response = http.request(request)
      end_time = Time.current

      Rails.logger.info "Response received in #{(end_time - start_time).round(2)}s"
      Rails.logger.info "Response code: #{response.code}"

      if response.code != "200"
        Rails.logger.error "API returned #{response.code} for #{currency[:code]}: #{response.body}"
        Rails.logger.error "Response headers: #{response.to_hash}"
        return nil
      end

      Rails.logger.info "Successfully fetched data for #{currency[:code]}: #{response.body.length} bytes"
      Rails.logger.debug "Response body preview: #{response.body[0..200]}..."

      data = JSON.parse(response.body)
      Rails.logger.info "Parsed JSON data for #{currency[:code]}: #{data.length} entries"

      latest = data.max_by { |entry| entry["timestamp"].to_i }

      result = {
        code: currency[:code],
        name: currency[:code].tr("-", " to "),
        price: latest["high"].to_f,
        change24h: latest["pctChange"].to_f,
        color: currency[:color]
      }

      Rails.logger.info "Processed data for #{currency[:code]}: price=#{result[:price]}, change=#{result[:change24h]}%"
      result

    rescue JSON::ParserError => e
      Rails.logger.error "JSON parsing error for #{currency[:code]}: #{e.message}"
      Rails.logger.error "Response body: #{response&.body}"
      nil
    rescue Net::OpenTimeout => e
      Rails.logger.error "Open timeout for #{currency[:code]}: #{e.message}"
      nil
    rescue Net::ReadTimeout => e
      Rails.logger.error "Read timeout for #{currency[:code]}: #{e.message}"
      nil
    rescue OpenSSL::SSL::SSLError => e
      Rails.logger.error "SSL error for #{currency[:code]}: #{e.message}"
      nil
    rescue StandardError => e
      Rails.logger.error "Error fetching #{currency[:code]}: #{e.message}"
      Rails.logger.error "Error class: #{e.class}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join(', ')}"
      nil
    end
  end
end
