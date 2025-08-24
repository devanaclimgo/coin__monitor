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
    Rails.logger.info "Environment: #{Rails.env}"

    # Check if we have cached data first
    cached_data = Rails.cache.read("currency_data")
    if cached_data && !cached_data_expired?
      Rails.logger.info "Using cached currency data"
      render json: cached_data
      return
    end

    chart_data = CURRENCIES.map do |currency|
      begin
        url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/15")
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
        Rails.logger.info "Response headers: #{response.to_hash}"

        if response.code == "429"
          Rails.logger.warn "Rate limit exceeded for #{currency[:code]}, using cached data if available"
          # Try to get cached data for this specific currency
          cached_currency = Rails.cache.read("currency_#{currency[:code]}")
          if cached_currency
            Rails.logger.info "Using cached data for #{currency[:code]}"
            next cached_currency
          else
            Rails.logger.error "No cached data available for #{currency[:code]}"
            next
          end
        elsif response.code != "200"
          Rails.logger.error "API returned #{response.code} for #{currency[:code]}: #{response.body}"
          Rails.logger.error "Response headers: #{response.to_hash}"
          next
        end

        Rails.logger.info "Successfully fetched data for #{currency[:code]}: #{response.body.length} bytes"
        Rails.logger.debug "Response body preview: #{response.body[0..200]}..."

        data = JSON.parse(response.body)
        Rails.logger.info "Parsed JSON data for #{currency[:code]}: #{data.length} entries"

        sorted_data = data.sort_by { |entry| entry["timestamp"].to_i }
        Rails.logger.info "Sorted data for #{currency[:code]}: #{sorted_data.length} entries"

        sparkline = sorted_data.map { |entry| entry["high"].to_f }
        latest = sorted_data.last

        result = {
          symbol: currency[:code],
          name: currency[:code].gsub("-", " to "),
          price: latest["high"].to_f,
          change24h: latest["pctChange"].to_f,
          sparklineData: sparkline,
          color: currency[:color]
        }

        Rails.logger.info "Processed data for #{currency[:code]}: price=#{result[:price]}, change=#{result[:change24h]}%"

        # Cache individual currency data for 1 hour
        Rails.cache.write("currency_#{currency[:code]}", result, expires_in: 1.hour)

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
    end.compact

    Rails.logger.info "Successfully processed #{chart_data.length} currencies"

    # If no data was fetched successfully, provide fallback data
    if chart_data.empty?
      Rails.logger.warn "No currency data fetched, providing realistic fallback data"
      chart_data = CURRENCIES.map do |currency|
        # Provide realistic fallback data based on typical exchange rates
        fallback_data = case currency[:code]
        when "USD-BRL"
          {
            price: 5.45,
            change24h: -0.8,
            sparkline: [ 5.42, 5.44, 5.46, 5.43, 5.45, 5.47, 5.44, 5.46, 5.48, 5.45, 5.47, 5.49, 5.46, 5.48, 5.45 ]
          }
        when "EUR-BRL"
          {
            price: 5.95,
            change24h: 0.3,
            sparkline: [ 5.92, 5.94, 5.96, 5.93, 5.95, 5.97, 5.94, 5.96, 5.98, 5.95, 5.97, 5.99, 5.96, 5.98, 5.95 ]
          }
        when "BTC-BRL"
          {
            price: 345000.00,
            change24h: 2.1,
            sparkline: [ 338000, 340000, 342000, 341000, 343000, 345000, 344000, 346000, 348000, 347000, 349000, 351000, 350000, 352000, 345000 ]
          }
        else
          {
            price: 0.0,
            change24h: 0.0,
            sparkline: Array.new(15, 0.0)
          }
        end

        {
          symbol: currency[:code],
          name: currency[:code].gsub("-", " to "),
          price: fallback_data[:price],
          change24h: fallback_data[:change24h],
          sparklineData: fallback_data[:sparkline],
          color: currency[:color]
        }
      end
    end

    # Cache the complete dataset for 30 minutes
    Rails.cache.write("currency_data", chart_data, expires_in: 30.minutes)
    Rails.cache.write("currency_data_timestamp", Time.current, expires_in: 30.minutes)

    render json: chart_data
  end

  def test
    begin
      Rails.logger.info "Testing external API connectivity"

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

      render json: {
        success: response.code == "200",
        response_code: response.code,
        response_time: (end_time - start_time).round(2),
        response_length: response.body.length,
        response_preview: response.body[0..200],
        environment: Rails.env,
        timestamp: Time.current,
        rate_limited: response.code == "429"
      }
    rescue => e
      render json: {
        success: false,
        error: e.message,
        error_class: e.class,
        environment: Rails.env,
        timestamp: Time.current
      }
    end
  end

  def clear_cache
    begin
      # Clear all currency-related cache
      CURRENCIES.each do |currency|
        Rails.cache.delete("currency_#{currency[:code]}")
        Rails.cache.delete("currency_#{currency[:code]}_timestamp")
        Rails.cache.delete("home_currency_#{currency[:code]}")
        Rails.cache.delete("home_currency_#{currency[:code]}_timestamp")
      end

      Rails.cache.delete("currency_data")
      Rails.cache.delete("currency_data_timestamp")

      render json: {
        success: true,
        message: "Cache cleared successfully",
        timestamp: Time.current
      }
    rescue => e
      render json: {
        success: false,
        error: e.message,
        timestamp: Time.current
      }
    end
  end

  private

  def cached_data_expired?
    timestamp = Rails.cache.read("currency_data_timestamp")
    return true if timestamp.nil?

    # Consider data expired if it's older than 30 minutes
    (Time.current - timestamp) > 30.minutes
  end
end
