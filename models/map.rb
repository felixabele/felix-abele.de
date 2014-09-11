class Map < ActiveRecord::Base
  # id, map_file, width, height, NAME, geo_settings, ref_point, country
  
  #has_many :cities, :finder_sql => Proc.new {%Q{SELECT * FROM cities WHERE country = '#{country}'}}
  #has_many :cities, :foreign_key => :country

  def cities
    City.where(:country => self.country)
  end
  
  # --- Load Small Version
  def self.getSmall
      self.where("size = :size", {:size => 's'})
  end
  
  # --- Load By Country and Version
  def self.byCountry(country, size)
      self.where("country = :country AND size = :size", 
        {:country => country, :size => size}).first
  end  
end