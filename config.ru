require "rubygems"
require "bundler"
Bundler.require(:default)

map "/" do
  use Rack::Static, 
		urls: ["/images", "/scripts", "/stylesheets"], 
		root: "public"

  run lambda { |env|
    headers = {
      "Content-Type"  => "text/html",
      "Cache-Control" => "public, max-age=86400"
    }
    body = File.open("public/index.html", File::RDONLY).read

    [200, headers, [body]]
  }
end