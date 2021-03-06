/**
 * Created by andrey on 12.06.14.
 */
define(function(require){

    // Modules

    var PubSub = require('pubsub');

    // Elems

    var form;
    var close;
    var popupBg;

    function show() {
        popupBg.classList.add('show');
        form.classList.add('show');
        close.addEventListener('click', hide);
    }

    function hide() {
        form.classList.remove('show');
        popupBg.classList.remove('show');
        close.removeEventListener('click', hide);
    }

    function init() {
        popupBg = document.querySelector('.popup-bg');
        form = document.querySelector('#regForm');
        close = form.querySelector('.js-close');
        PubSub.subscribe('regform.show', show);
        PubSub.subscribe('regform.hide', hide);
    }
    return {
        init: init
    }
});