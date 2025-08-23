Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    resources :currency, only: [ :index ]
  end
end
