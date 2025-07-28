Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    get "currency_data", to: "currency#index"
  end

  root "home#index"
end
