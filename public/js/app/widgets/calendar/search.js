/**
 * Created by andrey on 08.06.14.
 */
define(function(){
    function init() {
        PubSub.subscribe('event.search');

    }
    return {
        init: init
    }
});