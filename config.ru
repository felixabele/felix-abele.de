require 'rubygems'
require 'sinatra'
require './app.rb'
path = '/var/www/sinatra'
 
set :root, path
set :views, path + '/views'
set :public, path + '/public'
set :run, false # this line tells mongrel not to run and to let passenger handle the application
set :environment, :production
set :raise_errors, true 
 
run Sinatra::Application