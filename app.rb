require 'sinatra'
require 'yaml'
require 'active_record'
require 'geocoder'

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
# => Curriculum Vitae
# ===============================
get '/curriculum-vitae' do
  if params[:print]
    erb :cv_print, :layout => false
  else
    erb :cv, :layout => false
  end
end

# ===============================
# => Map-Detail
# ===============================
get '/map/:country/show.html' do   
  @map = Map.byCountry(params[:country], 'l')
  @cities = City.find_all_by_country(params[:country])
  erb :show, :layout => :ajax
end

# ===============================
# => Project-Detail
# ===============================
get '/project/:id' do   
  @project = Project.find(params[:id])
  erb :project, :layout => :ajax
end

# ===============================
# => Project-Detail
# ===============================
get '/map/example' do   
  erb :example
end

# ===============================
# => Geocoding-Index
# ===============================
get '/geocode' do   
  erb :geocode
end

# --- Submit Geocoder-Form
post '/geocode' do   
  @places = params[:places]
  @geocodes = Array.new;
  
  @places.split(',').each do |place|
    place.strip!
    geo = Geocoder.search(place)
    unless geo.nil?
      pl = geo.first
      @geocodes.push( 
        "{title: '#{place}', size: 10, coord: [#{pl.geometry['location']['lng']}, #{pl.geometry['location']['lat']}]}" 
      );
    end
  end
  erb :geocode
end