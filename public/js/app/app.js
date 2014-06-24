define(function(require){

//  Iterate through all widgets and call their
//  init method

    var calendar = require('widgets/calendar/index');

    function init() {
        calendar.init();
        console.log('App initialized');
    }

    return {
        init: init
    };
});