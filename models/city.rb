class City < ActiveRecord::Base
  # id, maps_id, title, size, lon, lat
  
  belongs_to :map
end