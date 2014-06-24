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
    var save;
    var del;

    function showForm() {
        popupBg.classList.add('show');
        form.classList.add('show');
        close.addEventListener('click', hideForm);
        save.addEventListener('click', saveEvent);
        del.addEventListener('click', deleteEvent);
    }

    function hideForm() {
        form.classList.remove('show');
        popupBg.classList.remove('show');
        close.removeEventListener('click', hideForm);
        save.removeEventListener('click', saveEvent);
        del.removeEventListener('click', deleteEvent);
    }

    function saveEvent(e) {
        e.preventDefault();
        var formElems = form.elements;
        var event = {
            name: formElems.eventName.value,
            date: formElems.eventDate.value,
            participants: formElems.eventParticipants.value,
            description: formElems.eventDescription.value
        };
        PubSub.publish('event.add', event);
    }

    function deleteEvent(e) {
        e.preventDefault();
        PubSub.publish('event.remove');
    }

    function init() {
        popupBg = document.querySelector('.popup-bg');
        form = document.querySelector('#eventForm');
        save = document.querySelector('#eventSave');
        del = document.querySelector('#eventDelete');
        close = form.querySelector('.js-close');
        PubSub.subscribe('eventform.show', showForm);
        PubSub.subscribe('eventform.hide', hideForm);
    }
    return {
        init: init
    }
});