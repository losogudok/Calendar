/**
 * Created by andrey on 24.06.14.
 */
define(function(){

    // Modules

    var db = require('calendarDb');
    var ajax = require('ajax');
    var PubSub = require('pubsub');

    var eventModel = {
        init: function() {

        },
        create: function(evtObj) {
            Promise.all([db.addItem(evtObj), ajax.postJSON(evtObj)]).then(function(){
                PubSub.publish('event.added');
            },
            function(){

            });
        }
    }
});