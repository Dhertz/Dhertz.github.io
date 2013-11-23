require "rubygems"
require "sinatra"
require "haml"
require "date"

get "/" do
  dob = Date.new(1993, 8, 25)
  now = Date.today
  @Age = now.year - dob.year -
    ((now.month > dob.month ||
  	  (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
  haml :index
end