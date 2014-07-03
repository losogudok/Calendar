/**
 * Created by andrey on 24.06.14.
 */
define(function(){

    // Modules

    var db = require('calendarDb');
    var ajax = require('ajax');
    var PubSub = require('pubsub');

    var Event = function() {

    };

    Event.prototype = {
        create: function(msg, event) {
            db.
        },
        read: function() {

        },
        update: function() {

        },
        remove: function() {

        }
    };
    PubSub.subscribe('event.create', Event.create);
    PubSub.subscribe('event.read', Event.read);
    PubSub.subscribe('event.update', Event.update);
    PubSub.subscribe('event.remove', Event.remove);
});