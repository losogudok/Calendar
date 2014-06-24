define(function(require){

    var PubSub = require('pubsub');
    var listeners = require('./listeners');
    var cells = require('./views/cellsView');
    var nav = require('./nav');
    var login = require('./login');
    var reg = require('./reg');
    var date = require('./date');
    var event = require('./event');
    var db = require('./calendarDB');
    var offline = require('./../../../helpers/offline');
    var ui = require('./views/onlineView');


    function init() {
        date.init();
        cellsView.init();
        nav.init();
        login.init();
        reg.init();
        event.init();
        listeners.init();
        db.init();
        onlineView.init();
        offline.init();
        PubSub.publish('month.change');
        console.log('Calendar initialized');
    }

    return {
        init: init
    }
});