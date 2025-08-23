Rails.application.routes.draw do
  root "home#index"

  get "/api/currency", to: "home#currency_data"
end
