Rails.application.routes.draw do
  get "*path", to: "home#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
