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
    Rails.logger.info "Request headers: #{request.headers.to_h.select { |k, v| k.start_with?('HTTP_') }}"

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

        if response.code != "200"
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
        timestamp: Time.current
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
end
