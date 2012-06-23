// jQuery Geo-Cloud-Plugin
// Country Map with custum Elements
// version 0.4, 08.06.2012
// by Felix Abele

(function($) {

    // ---> GeoCloud-Plugin Start
    $.geocloud = function(element, options) {

        var $element = $(element),
             element = element;

        // --- Default-Options
        var defaults = {            
            element: $element,
            geo_settings: {
              x_corr:   0.00, // x-Curvation-Fix Value
              y_corr:   0.00, // y-Curvation-Fix Value
              coef:     0.00  // Coordinate-Pixel Coefficient
            },
            ref_point: {
              pixel_point: [200, 200],  // Reference Point (Pixel)
              coord: [0.00, 0.00]       // ... Geo-Coordinates
            },
            width: 400,                 // Map-width
            height: 600,                // Map-height
            map_src: 'maps/default.jpg' // Map-Source
        }

        // use "plugin" to reference the current instance of the object
        var plugin = this;

        // Plugin-Settings
        plugin.settings = {}


        // ----------------------------------------
        //      INITIALISATION
        // ----------------------------------------
        // the "constructor" method that gets called when the object is created
        plugin.init = function() {
            // Extend Default-Settings with Customs
            plugin.settings = $.extend({}, defaults, options);
            plugin.element = $element;
            
            // Draw the Map
            $element.css({
                'background-image': 'url('+ plugin.settings.map_src +')',
                'width': plugin.settings.width, 
                'height': plugin.settings.height,
                'position': 'relative'
            });
            $element.addClass('geo_cloud');
        }


        // ----------------------------------------
        //      Public Methods
        // ----------------------------------------
        // --- Draw A Point
        //     @params: 
        //          city = {'title': 'Roma', 'pixel_point': [363, 549], 'coord': [12.4942486, 41.8905198]}
        //          opt  = {'attr': {}, 'css': {}, events {'onClick': function(){}}}
        plugin.drawPoint = function( city, opt ) {                        
            
            // Set opt to default if unset
            if (!opt) {
                var opt = {css: {}, events: {}, attr: {}};
            }
            
            // get Pixel-Point from Geo-Point
            var point = get_by_reference( city.coord ),
                dot = $( '<div></div>' ),
                rad = city.size/2,
                x = parseInt( point[0]-rad ),
                y = parseInt( point[1]-rad ),
                styles = $.extend({}, {
                    'left': x, 'bottom': y, 'height': city.size, 'width': city.size, 
                    'border-radius':rad+2, 'position': 'absolute'}, 
                    opt.css),
                attrs = $.extend({}, {'title': city.title}, city.attr, opt.attr);
            
            dot.css(styles);
            dot.attr(attrs);
            
            // Bind Listeners            
            $.each(opt.events, function(type, fn) { 
                dot.bind(type, {city: city}, fn);
            });
            plugin.element.append(dot);
            return dot;
        }
        
        // --- Draw an Array of points
        plugin.drawPoints = function( cities, opt ) {
            for(var i=0; i<cities.length; i++) {
                plugin.drawPoint(cities[i], opt);
            }
        }

        // ----------------------------------------
        //      Private Methods
        // ----------------------------------------
        // --- Calculate Point in pixel by Reference Geo-Value
        var get_by_reference = function(coords) {
            var coef = plugin.settings.geo_settings.coef;
            var ref_p = plugin.settings.ref_point;
            
            var gr_lng_diff = coords[0]-ref_p.coord[0];
            var gr_lat_diff = coords[1]-ref_p.coord[1];

            var px_x_diff = gr_lng_diff/coef;  
            var px_y_diff = gr_lat_diff/coef;  

            // Korrektur-Wert fuer Edkruemmung (gilt nur fuer Deutschland)
            px_x_diff *= plugin.settings.geo_settings.x_corr;
            px_y_diff *= plugin.settings.geo_settings.y_corr;        

            var px_x = ref_p.pixel_point[0] + px_x_diff;
            var px_y = ref_p.pixel_point[1] + px_y_diff;      

            return [px_x, px_y];
        }

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.geocloud = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('geocloud')) {

                var plugin = new $.geocloud(this, options);
                $(this).data('geocloud', plugin);
            }
        });
    }
})(jQuery);