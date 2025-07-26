Rails.application.routes.draw do
  resources :posts
  get "*path", to: "application#frontend", constraints: ->(req) { !req.xhr? && req.format.html? }
end
