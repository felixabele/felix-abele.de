class Project < ActiveRecord::Base
  # id, title, year, month, private, effort, content
  
  # ---- Returns this Project as JSon
  def custom_json
    
    # is private ? 
    if self.private 
      dir = 'down' 
    else 
      dir = 'up' 
    end
     
    "{title: '#{self.title}', year: #{self.year}, month: #{self.month}, doc: 'project/#{self.id}', dir: '#{dir}', height: #{self.effort}}"
  end
end