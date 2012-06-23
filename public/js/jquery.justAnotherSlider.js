// jQuery Just-Another-Slider-Plugin
// its supposed to be the most simple jQuery Slider on earth
// version 0.1, 1708.06.2012
// by Felix Abele

(function($) {

    // ---> justAnotherSlider-Plugin Start
    $.justAnotherSlider = function(element, options) {

        var $element = $(element),
             element = element;

        // --- Default-Options
        var defaults = {
            element: $element,
            width: 400,
            height: 300,
            delay: 500,
            goLeft: null,
            goRight: null,
            carousel: false,
            
            // Following will be set by Plugin
            current_element: 0,
            element_count: 0
        }

        var plugin = this;
        plugin.settings = {};
        plugin.slider = {};


        // ----------------------------------------
        //      INITIALISATION
        // ----------------------------------------
        plugin.init = function() {
            // Extend Default-Settings with Customs
            plugin.settings = $.extend({}, defaults, options);
            plugin.element = $element;               
            
            // Set Slider-Element
            plugin.slider = $element.find('ul');
            var slider_elements = $element.find('li');  
            plugin.settings.element_count = slider_elements.length;
            
            // Set the Slider
            $element.css({
                'overflow': 'hidden', 'position': 'relative',
                'width': plugin.settings.width, 
                'height': plugin.settings.height
            });
            plugin.slider.css({
                'position': 'relative', 'display': 'block',
                'width': (slider_elements.length * plugin.settings.width)
            }); 
            slider_elements.css({
                'float': 'left', 'list-style': 'none',
                'width': plugin.settings.width, 'height': plugin.settings.height
            })
            
            // Assign Events
            plugin.settings.goLeft.click(function(){
                plugin.goLeft();
            });
            plugin.settings.goRight.click(function(){                
                plugin.goRight();
            });  
            
            // is carousel enabled ? Don't hide controllers !
            if (!plugin.settings.carousel) {
                hideControllers();
            }
        }


        // ----------------------------------------
        //      Public Methods
        // ----------------------------------------
        // --- Go Left
        plugin.goLeft = function( ) {
            plugin.moveToElement( plugin.settings.current_element-1 ); 
        }
        
        // --- Go Right
        plugin.goRight = function( ) { 
            plugin.moveToElement( plugin.settings.current_element+1 );                
        }
        
        // --- Move Slider to xx (with effect)
        plugin.moveToElement = function( index ) {
            // is carousel enabled ?
            if (plugin.settings.carousel) {                
                if (index == (plugin.settings.element_count)) {
                    index = 0;
                } else if (index < 0) {
                    index = (plugin.settings.element_count-1);
                }
            }
            
            plugin.settings.current_element = index;            
            plugin.slider.animate({
                right: (index*plugin.settings.width)
            }, plugin.settings.delay, function() {                
                if (!plugin.settings.carousel) {
                    hideControllers();
                }
            });
        }
        
        // --- Jump Slider to xx (without effect)
        plugin.jumpToElement = function( index ) {        
            plugin.slider.css({right: (index*plugin.settings.width)});
        }        
        
        // Check if Controllers need to be hidden
        var hideControllers = function() {
            if (plugin.settings.current_element == 0) {
                plugin.settings.goLeft.css('visibility','hidden');
            } else if (plugin.settings.goLeft.css('visibility') == 'hidden') {
                plugin.settings.goLeft.css('visibility','visible');
            } 

            if (plugin.settings.current_element == ( plugin.settings.element_count-1 )) {
                plugin.settings.goRight.css('visibility','hidden');
            } else if (plugin.settings.goRight.css('visibility') == 'hidden') {
                plugin.settings.goRight.css('visibility','visible');
            }
        }
        
        // Start
        plugin.init();
    }            

    // add the plugin to the jQuery.fn object
    $.fn.justAnotherSlider = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('justAnotherSlider')) {
                var plugin = new $.justAnotherSlider(this, options);
                $(this).data('justAnotherSlider', plugin);
            }
        });
    }
})(jQuery);