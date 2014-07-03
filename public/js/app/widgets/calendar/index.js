define(function(require){

    // Views
    var cellsView = require('./views/cellsView');
    var onlineView = require('./views/onlineView');
    
    var nav = require('./nav');
    var login = require('./login');
    var reg = require('./reg');
    var event = require('./event');
    var db = require('./storage/calendarDB');
    var offline = require('helpers/offline');
    


    function init() {
        // date.init();
        // cellsView.init();
        // nav.init();
        // login.init();
        // reg.init();
        // event.init();
        // listeners.init();
        db.init();
        onlineView.init();
        console.log('Calendar initialized');
    }

    return {
        init: init
    }
});