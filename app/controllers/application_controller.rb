class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def frontend
    render file: Rails.public_path.join("vite-assets", "index.html"), layout: false
  end
end
