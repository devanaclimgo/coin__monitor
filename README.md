# 📈 Coin Monitor: Real-Time Currency Tracking (Rails App)

![Ruby](https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white) ![Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)	![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Ruby on Rails | API Integration | Data Visualization

A containerized Rails application that tracks USD, EUR, and BTC exchange rates against BRL with beautiful charts - no Ruby installation needed!

### 💡 The Idea

I wanted a simple way to monitor how key currencies (USD, EUR, BTC) fluctuate against the Brazilian Real, with:
- Clear historical data visualization
- Automatic daily updates
- Easy-to-read charts

### ✨ Features
- Real-time currency tracking (USD, EUR, BTC to BRL)
- 30-day historical data visualization
- Automatic daily updates
- Responsive design with interactive charts
- Dockerized for easy deployment
- Hybrid Hotwire + React architecture

### 🚀 Project Status
Current implementation:
- ✅ Backend API integration with AwesomeAPI
- ✅ Basic data visualization with Chart.js
- ✅ Docker configuration

Planned improvements:
- Modern frontend redesign using React
- Hybrid Hotwire + React implementation
- Enhanced chart interactivity
- User preferences (custom time ranges, currency selection)

### 🛠️ How I Built It

Backend:
- Ruby on Rails 7
- PostgreSQL
- Net::HTTP for API requests

Frontend:
- React (via jsbundling-rails)
- TypeScript
- Hotwire (Turbo + Stimulus)
- Chart.js

Infrastructure:
- Docker
- Docker Compose

### 🏗️ Architecture

The app uses a hybrid approach:
- Rails serves as the API backend and handles initial page rendering
- React components are embedded for interactive UI elements
- Hotwire (Turbo + Stimulus) handles the progressive enhancement

-> Key Components

💰 Currency Configuration
```ruby
CURRENCIES = [
  { code: 'USD-BRL' },  # US Dollar
  { code: 'EUR-BRL' },  # Euro
  { code: 'BTC-BRL' }   # Bitcoin
]
```
- Easy to add new currencies by extending the array

📊 Data Fetching Logic
```ruby
url = URI("https://economia.awesomeapi.com.br/json/daily/#{currency[:code]}/30")
response = Net::HTTP.get(url)
data = JSON.parse(response)
```
- Gets 30 days of historical data
- Handles JSON parsing automatically

🗓️ Date Formatting
```ruby
Time.at(entry['timestamp'].to_i).strftime("%d/%m/%y")
```
- Converts UNIX timestamps to readable dates

### 🐳 Docker Deployment
1. Clone the repository:
```bash
git clone https://github.com/devanaclimgo/coin_monitor_ts.git
cd coin_monitor_ts
```
2. Build and start the containers:
```bash
docker-compose build
docker-compose up
```
3. Access the app at ```http://localhost:3000```

## 🖥️ Development Setup
### Prerequisites:
- Ruby 3.x
- PostgreSQL
- Node.js 16+
- Yarn

### Installation
1. Install dependencies:
```bash
bundle install
yarn install
```
2. Set up the database:
```bash
rails db:create db:migrate
```
3. Start the development servers:
```bash
bin/dev
```

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (```git checkout -b feature/amazing-feature```)
3. Commit your changes (```git commit -m 'Add some amazing feature'```)
4. Push to the branch (```git push origin feature/amazing-feature```)
5. Open a pull request

## 🙏 Acknowledgments
- AwesomeAPI for the free currency data
- Chart.js for data visualization
- V0.dev for design inspiration

###### Built with ❤️ by Ana - 2025
