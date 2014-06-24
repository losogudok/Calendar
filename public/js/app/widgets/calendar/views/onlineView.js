/**
 * Created by andrey on 14.06.14.
 */
define(function(require){

    //     Modules

    var PubSub = require('pubsub');

    //    Element

    var rootEl = document.querySelector('#onlineIcon');

    // Render functions

    function showOnlineIcon() {
        rootEl.classList.remove('offline');
        onlineIcon.classList.add('online');
    }

    function showOfflineIcon() {
        onlineIcon.classList.add('offline');
        onlineIcon.classList.remove('online');
    }


    function init() {
        PubSub.subscribe('online', showOnlineIcon);
        PubSub.subscribe('offline', showOfflineIcon);
    }

    return {
        init: init
    }
});