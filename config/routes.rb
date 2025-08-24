Rails.application.routes.draw do
  root "home#index"
  get "health", to: "home#health"
  get "test_api", to: "home#test_external_api"

  namespace :api do
    get "currency", to: "currency#index"
    get "currency/test", to: "currency#test"
  end
end
