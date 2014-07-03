/**
 * Created by andrey on 14.06.14.
 */
define(function(require){

    //     Modules

    var PubSub = require('pubsub');

    var onlineView = {
        rootEl: document.querySelector('#onlineIcon'),
        init:  function() {
            PubSub.subscribe('online', this.showOnlineIcon);
            PubSub.subscribe('offline', this.showOfflineIcon);
        },
        showOnlineIcon: function() {
            this.rootEl.classList.remove('offline');
            this.rootEl.classList.add('online');
        },
        showOfflineIcon: function() {
            this.rootEl.classList.add('offline');
            this.rootEl.classList.remove('online');
        }
    };
    
    return onlineView;
});