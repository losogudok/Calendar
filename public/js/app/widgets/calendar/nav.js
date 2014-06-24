/**
 * Created by andrey on 12.06.14.
 */
define(function(require){
    // Modules

    var PubSub = require('pubsub');
    var locale = require('locale/ru');
    
    // Elems

    var monthField,
        prevMonthBtn,
        nextMonthBtn;

    function updateNav(msg, data) {
        monthField.textContent = locale.months[data.curr.month];
        prevMonthBtn.dataset.date = data.prev.time;
        nextMonthBtn.dataset.date = data.next.time;
    }

    function init() {
        monthField = document.querySelector('.js-nav-text');
        prevMonthBtn = document.querySelector('.js-nav-prev');
        nextMonthBtn = document.querySelector('.js-nav-next');
        PubSub.subscribe('month.paint', updateNav);
    }
    return {
        init: init
    }
});