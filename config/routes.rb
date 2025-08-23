Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    get "currency", to: "currency#index"
  end
end
