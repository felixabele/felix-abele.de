/* 
 * My Project Graph
 * by Felix Abele, felix.abele@gmail.com
 */

var projectGraph = (function () {

    var stage;
    var update = true;
    var element_id = 'stageCanvas';

    // Timeline Parameters
    var glob_shadow = new createjs.Shadow("#ffffff", 2, 2, 4);
    var glob_color = "#808080";
    var glob = {height:400, width:700}
    var tl_start = {x:0, y:(glob.height/2)};
    var tl_end = {x:glob.width, y:(glob.height/2)};

    /*
        240: {
        title: "Instant-Messenger",
        doc: "content/projekt_1.html",
        dir: "up",
        height: 50},
        420: {
        title: "Beer App",
        doc: "bla.html",
        dir: "down",
        height: 80}
    **/
   
    // Open Content in Fancy Box
    var open_fancy = function (project) {
        $.ajax({
            type    : "GET",
            cache   : false,
            url     : project.doc,
            data    : $(this).serializeArray(),
            success: function(data) {                    
                $.fancybox({
                    content: data,
                    'afterShow': function(){
                        init_skippers(project.index);
                    }
                });
            }
        });   
    }

    var tick = function () {
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update();
        }
    }

    // Draw a Line from to
    var draw_line = function (start, end) {
        var g = new createjs.Graphics();
        g.setStrokeStyle(0.8);
        g.beginStroke(glob_color);
        g.moveTo((start.x), start.y).lineTo((end.x+80), end.y);
        var s = new createjs.Shape(g);
        s.shadow = glob_shadow;
        stage.addChild(s);
    }

    // Draw a Special Dot
    var draw_dot = function (x, proj) {
        var line_end = (proj.dir == 'up') ? (tl_start.y-proj.height) : (tl_start.y+proj.height);
        var r = 6;

        var g = new createjs.Graphics();
        g.setStrokeStyle(1);
        g.beginStroke(glob_color);
        g.beginFill("#FFFFFF").drawCircle(0, 0, r);
        g.beginFill("#FFFFFF").drawCircle(0, 0, (r-3));
        var s = new createjs.Shape(g);
        s.x = x;
        s.y = line_end;
        s.shadow = glob_shadow;
        stage.addChild(s);

        // -- Mouse Events
        s.onMouseOver = function() {
            s.scaleX = 1.4;
            s.scaleY = 1.4;
            $('body').css( 'cursor', 'pointer' ); // Change Cursor to pointer
            update = true;
        }
        s.onMouseOut = function() {
            s.scaleX = 1;
            s.scaleY = 1;
            $('body').css( 'cursor', 'default' ); // Change Cursor back to default
            update = true;
        }
        s.onPress = function() {
            open_fancy(proj);
        }
        
        //createjs.Ticker.addListener(stage);
        createjs.Ticker.addEventListener("tick", stage);
    }

    // Draw a vertical Line (connected to the Timeline)
    var draw_vertical = function (from, proj) {
        var line_end = (proj.dir == 'up') ? (tl_start.y-proj.height) : (tl_start.y+proj.height);
        var text_posi = (proj.dir == 'up') ? (line_end-26) : (line_end+16);
        var g = new createjs.Graphics();
        g.setStrokeStyle(0.8);
        g.beginStroke(glob_color);
        g.moveTo(from, tl_start.y).lineTo(from, line_end);
        var s = new createjs.Shape(g);
        s.shadow = glob_shadow;
        stage.addChild(s);

        // Text hinzufügen
        var txt = new createjs.Text(proj.title, "9px Trebuchet MS,Arial,sans-serif", glob_color);
        txt.textBaseline = "top";
        txt.y = text_posi;
        txt.x = (from-25);
        txt.shadow = glob_shadow;
        stage.addChild(txt);

        // Draw Dot
        draw_dot(from, proj);
    }

    // Draw A Year Section
    var draw_year = function (x, txt) {

        var padding = 20;
        var g = new createjs.Graphics();
        g.setStrokeStyle(1);
        g.beginStroke("#3333CC");
        g.moveTo(x, padding).lineTo(x, glob.height-padding);
        var s = new createjs.Shape(g);
        s.alpha = 0.3;
        stage.addChild(s);

        // Draw Year
        var txt = new createjs.Text(txt, "10px Georgia,serif", "#3333CC");
        txt.textBaseline = "top";
        txt.x = (x-15);
        stage.addChild(txt);
    }

    // --- Act as endless loop
    // Next project
    var get_next_project = function (ind) {
        if (ind == (projects.length-1))
            ind = -1;
        return projects[ind+1];
    }

    // Prev Project
    var get_prev_project = function (ind) {
        if (ind == 0)
            ind = projects.length;
        return projects[ind-1];
    }

    // INIT Skippers
    var init_skippers = function (proj_index) {

        var l_skip = $("<div id='skip_left'></div>");
        var r_skip = $("<div id='skip_right'></div>");

        // do skip keft
        l_skip.click(function() {
            open_fancy(get_prev_project(proj_index));
        });

        // do skip right
        r_skip.click(function() {               
            open_fancy(get_next_project(proj_index))
        });            

        $('.fancybox-wrap').prepend(l_skip);
        $('.fancybox-wrap').append(r_skip);
    }



    // ------------------------------------------
    // initialize function, called when page loads.
    // ------------------------------------------
    var draw_graph = function () {

        //check and see if the canvas element is supported
        if(!(!!document.createElement('canvas').getContext)) {
            var wrapper = document.getElementById("canvasWrapper");
            wrapper.innerHTML = "Dein Browser unterstützt kein Canvas Element " +
            " es lohnt sich einen Browser zu installieren, der HTML 5 unterstützt";
            return;
        }

        // Calculate Dates'n'offsets
        var today = new Date();
        var start = new Date("01/01/2009");
        var year_count = ((today.getFullYear()+1) - start.getFullYear());
        var year_offset = (glob.width/year_count);
        var month_offset = parseInt(year_offset/12);

        // Build a map containing all Years with their x-Positions
        var years = new Array();
        for (i=0; i<=year_count; i++) {
            years[start.getFullYear()+i] = (year_offset*i)+50;
        }


        //get a reference to the canvas element
        var canvas = document.getElementById(element_id);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10); // enabled mouse over / out events

        // Draw Timeline
        draw_line(tl_start, tl_end);

        // Draw Vertical Lines
        for (z=0; z<projects.length; z++) {
            var proj = projects[z];
            proj.index = z;
            x = years[proj.year] + (proj.month*month_offset);
            draw_vertical(x, proj);
        }

        // Draw Years
        for (year in years) {
            draw_year(years[year], year);
        }

        // Render That Thing
        stage.update();
    }
    
    // ------------------------------------------
    //  Define Public Functions
    // ------------------------------------------    
    return {
        init: draw_graph
    }

}());