#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'

puts "Testing external API connectivity..."

begin
  url = URI("https://economia.awesomeapi.com.br/json/daily/USD-BRL/1")
  
  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  http.open_timeout = 10
  http.read_timeout = 10
  http.verify_mode = OpenSSL::SSL::VERIFY_NONE

  request = Net::HTTP::Get.new(url)
  request["User-Agent"] = "CoinMonitor/1.0 (https://coin-monitor.onrender.com)"
  request["Accept"] = "application/json"
  
  puts "Making request to #{url}..."
  start_time = Time.now
  response = http.request(request)
  end_time = Time.now
  
  puts "Response received in #{(end_time - start_time).round(2)}s"
  puts "Response code: #{response.code}"
  puts "Response length: #{response.body.length} bytes"
  
  if response.code == "200"
    data = JSON.parse(response.body)
    puts "Successfully parsed JSON data: #{data.length} entries"
    puts "Sample data: #{data.first}"
  else
    puts "Error: #{response.body}"
  end
  
rescue => e
  puts "Error: #{e.message}"
  puts "Error class: #{e.class}"
end
