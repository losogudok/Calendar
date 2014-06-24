/**
 * Created by andrey on 14.06.14.
 */
define(function(require){
    var PubSub = require('pubsub');

        window.addEventListener("offline", function(e) {
            PubSub.publish('offline');
        }, false);

        window.addEventListener("online", function(e) {
            PubSub.publish('online');
        }, false);
        if (navigator.onLine) {
            PubSub.publish('online');
        } else {
            PubSub.publish('offline');
        }
});