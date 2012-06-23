require 'sinatra'
require 'yaml'
require 'active_record'

require './config/db'
require './models/map'
require './models/city'
require './models/project'

# ===============================
# => Start
# ===============================
get '/' do
  @projects = Project.find(:all, 
    :select => "id, title, year, month, private, effort")
  erb :index
end

# ===============================
# => Code
# ===============================
get '/code' do
  @maps = Map.getSmall
  erb :code
end

# ===============================
# => Map-Detail
# ===============================
get '/map/:country/show.html' do   
  @map = Map.byCountry(params[:country], 'l')
  erb :show, :layout => :ajax
end

# ===============================
# => Project-Detail
# ===============================
get '/project/:id' do   
  @project = Project.find(params[:id])
  erb :project, :layout => :ajax
end
