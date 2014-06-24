/**
 * Created by andrey on 31.05.14.
 */
define(function(require){

    // Modules

    var PubSub = require('pubsub');


    // Elements

    var calendarBody = document.querySelector('#calendarBody');
    var nav = document.querySelector('#calendarNav');
    var addBtn = document.querySelector('#addEvent');
    var loginBtn = document.querySelector('#login');
    var searchField = document.querySelector('#search');
    var regBtn = document.querySelector('#reg');

    // Delegate Events

    function delegate(target, eventEl, klass) {
        var el = target;
        while (!el.classList.contains(klass) && el != eventEl) {
            el = el.parentNode;
        }
        if (el === eventEl) {
            return null;
        }
        return el;
    }

    // Delegate browser event to custom events

    function onNavClick(e) {
        var target = delegate(e.target, this, 'js-calendar-nav');
        if (target) {
            PubSub.publish('month.change', +target.dataset.date);
        }
    }

    function onCellClick(e) {
        var target = delegate(e.target, this, 'js-current-month');
        if (target) {
            PubSub.publish('eventform.show', target.dataset.date);
        }
    }

    function onAddBtnClick() {
        PubSub.publish('quickevent.show');
    }

    function onLoginBtnClick() {
        PubSub.publish('loginform.show');
    }

    function onRegBtnClick() {
        PubSub.publish('regform.show');
    }

    function onSearchKeypres() {
        PubSub.publish('event.search');
    }


    function init() {
        nav.addEventListener('click', onNavClick, false);
        calendarBody.addEventListener('click', onCellClick, false);
        addBtn.addEventListener('click', onAddBtnClick, false);
        loginBtn.addEventListener('click', onLoginBtnClick, false);
        regBtn.addEventListener('click', onRegBtnClick, false);
        searchField.addEventListener('keypress', onSearchKeypres, false);
    }

    return {
        init: init
    }
});