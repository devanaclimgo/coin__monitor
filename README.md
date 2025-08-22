# 🌍 Coin Monitor

A real-time currency monitoring web application built with Ruby on Rails, featuring live exchange rates, interactive charts, and a beautiful glassmorphism UI design.

![Coin Monitor](https://img.shields.io/badge/Ruby-3.0+-red.svg)
![Rails](https://img.shields.io/badge/Rails-7.0+-red.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-blue.svg)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-yellow.svg)

## ✨ Features

- **Real-time Currency Data**: Live exchange rates for USD-BRL, EUR-BRL, and BTC-BRL
- **Interactive Line Charts**: Beautiful 15-day price trend visualization using Chart.js
- **Responsive Design**: Modern glassmorphism UI that works on all devices
- **Live Updates**: Currency prices and 24h change percentages
- **Market Overview**: Comprehensive market summary with visual indicators

## 🛠️ Tech Stack

### Backend

- **Ruby on Rails 7.0+**: Modern web framework for robust backend development
- **Ruby 3.0+**: High-level programming language
- **SQLite**: Lightweight database for development
- **Puma**: High-performance web server

### Frontend

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Chart.js**: Interactive JavaScript charts for data visualization
- **Vanilla JavaScript**: Custom animations and interactions
- **HTML5/ERB**: Semantic markup with Rails templating

### APIs & External Services

- **AwesomeAPI**: Brazilian economy API for real-time currency data

### Development Tools

- **Bundler**: Ruby dependency management
- **Yarn**: JavaScript package management
- **Git**: Version control system

## 📊 API Integration

### Currency Data Source

The application integrates with the **AwesomeAPI** Brazilian economy service:

# API Endpoint

https://economia.awesomeapi.com.br/json/daily/{CURRENCY_PAIR}/15

# Supported Currency Pairs

- USD-BRL (US Dollar to Brazilian Real)
- EUR-BRL (Euro to Brazilian Real)
- BTC-BRL (Bitcoin to Brazilian Real)

````

### Data Structure

```json
{
  "symbol": "USD-BRL",
  "name": "USD to BRL",
  "price": 5.2345,
  "change24h": 0.85,
  "sparklineData": [5.12, 5.15, 5.18, ...],
  "color": "#22c55e"
}
````

## 🚀 Installation & Setup

### Prerequisites

- Ruby 3.0 or higher
- Rails 7.0 or higher
- Node.js 16+ and Yarn
- Git

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/devanaclimgo/coin-monitor.git
   cd coin-monitor
   ```

2. **Install Ruby dependencies**

   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**

   ```bash
   yarn install
   ```

4. **Setup database**

   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

5. **Start the development server**

   ```bash
   bin/dev
   ```

6. **Visit the application**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
coin_monitor/
├── app/
│   ├── controllers/
│   │   ├── api/currency_controller.rb    # API endpoint for chart data
│   │   └── home_controller.rb            # Main page controller
│   ├── views/
│   │   └── home/
│   │       └── index.html.erb           # Main dashboard view
│   ├── assets/
│   │   ├── images/
│   │   │   ├── brazil-flag-icon.svg     # Brazilian flag icon
│   │   │   └── uk-flag-icon.svg         # UK flag icon
│   │   └── stylesheets/
│   │       └── application.css          # Custom styles + Tailwind
│   └── models/
├── config/
│   ├── routes.rb                        # Application routing
│   └── database.yml                     # Database configuration
├── Gemfile                              # Ruby dependencies
├── package.json                         # JavaScript dependencies
└── README.md                           # This file
```

## 🎨 UI/UX Features

### Design System

- **Glassmorphism**: Modern glass-like UI elements with backdrop blur
- **Dark Theme**: Elegant dark color scheme with gradient backgrounds
- **Responsive Grid**: Adaptive layout for desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects

### Interactive Elements

- **Currency Cards**: Hover effects with scale and shadow animations
- **Line Charts**: Interactive tooltips and responsive design
- **Real-time Indicators**: Color-coded price changes (green/red)

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (two column layout)
- **Desktop**: > 1024px (three column layout)

## 📈 Chart Features

### Chart.js Implementation

- **Line Charts**: Smooth curved lines with tension
- **Interactive Tooltips**: Hover information with price details
- **Responsive Design**: Adapts to container size
- **Custom Styling**: Dark theme with glassmorphism effects

### Data Visualization

- 15-day historical price trends
- Color-coded currency lines
- Real-time data updates
- Smooth animations and transitions

## 🔧 Configuration

### Environment Variables

```bash
# Database configuration
RAILS_ENV=development
DATABASE_URL=sqlite3:db/development.sqlite3

# Asset compilation
RAILS_SERVE_STATIC_FILES=true
```

### Tailwind Configuration

```yaml
# config/tailwind.config.yml
content:
  - app/views/**/*.erb
  - app/helpers/**/*.rb
  - app/javascript/**/*.js
```

## 🚀 Deployment

### Heroku Deployment

1. **Create Heroku app**

   ```bash
   heroku create your-app-name
   ```

2. **Set buildpacks**

   ```bash
   heroku buildpacks:add heroku/ruby
   heroku buildpacks:add heroku/nodejs
   ```

3. **Configure environment**

   ```bash
   heroku config:set RAILS_ENV=production
   heroku config:set RAILS_SERVE_STATIC_FILES=true
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku run rails db:migrate
   ```

### Alternative Deployment Options

- **Railway**: Modern Rails deployment platform
- **Render**: Easy deployment with automatic builds
- **DigitalOcean App Platform**: Scalable cloud deployment

## 🧪 Testing

### Running Tests

```bash
# Run all tests
rails test

# Run specific test files
rails test test/controllers/home_controller_test.rb
rails test test/models/post_test.rb
```

### Test Coverage

- Controller tests for API endpoints
- Model tests for data validation
- System tests for user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👩‍💻 Author

**Ana Gomes**

- GitHub: [@devanaclimgo](https://github.com/devanaclimgo)
- LinkedIn: [Ana Gomes](https://www.linkedin.com/in/ana-clara-gomes-48b83b224/)

## 🙏 Acknowledgments

- **AwesomeAPI** for providing reliable currency data
- **Chart.js** for powerful charting capabilities
- **Tailwind CSS** for the utility-first CSS framework
- **Rails community** for the excellent documentation and support

## 📞 Support

If you have any questions or need help with the project:

1. Check the [Issues](https://github.com/devanaclimgo/coin-monitor/issues) page
2. Create a new issue with detailed description
3. Contact me directly via GitHub

---

⭐ **Star this repository if you found it helpful!**

###### Built with ❤️ by Ana - 2025
