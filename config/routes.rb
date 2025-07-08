Rails.application.routes.draw do
  get "*path", to: "application#frontend", constraints: ->(req) { !req.xhr? && req.format.html? }
end
