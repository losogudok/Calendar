/**
 * Created by andrey on 14.06.14.
 */
define(function(require){

    var PubSub = require('pubsub');
    var transaction;
    var store;
    var request;
    var DB_NAME = 'Calendar';
    var DB_VERSION = 1; // Use a long long for this value (don't use a float)
    var DB_STORE_NAME = 'Events';
    var db;

    function openDb() {
        console.log("openDb ...");
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = function (evt) {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            // db = req.result;
            db = this.result;
            console.log("openDb DONE");
        };
        req.onerror = function (evt) {
            console.error("openDb:", evt.target.errorCode);
        };

        req.onupgradeneeded = function (evt) {
            console.log("openDb.onupgradeneeded");
            var store = evt.currentTarget.result.createObjectStore(
                DB_STORE_NAME, {autoIncrement: true });

            store.createIndex('name', 'name', { unique: false });
            store.createIndex('date', 'date', { unique: true });
            store.createIndex('participants', 'participants', { unique: false });
            store.createIndex('description', 'description', { unique: false });
        };
    }

    function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    function clearObjectStore(store_name) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.clear();
        req.onsuccess = function(evt) {
            displayActionSuccess("Store cleared");
            displayPubList(store);
        };
        req.onerror = function (evt) {
            console.error("clearObjectStore:", evt.target.errorCode);
            displayActionFailure(this.error);
        };
    }


    function addItem(msg, value) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.add(value);
        req.onsuccess = function (evt) {
            console.log("Insertion in DB successful");
        };
        req.onerror = function() {
            console.error("addPublication error", this.error);
        };
    }

    function getItem(value) {
        var store = getObjectStore(DB_STORE_NAME, 'readonly');
        req = store.get(value);
        req.onsuccess = function(e) {
            console.log(e.target.result);
        };
        req.onerror = function() {
            console.error("getItem error", this.error);
        };
    }

    function removeItem() {

    }

    function updateItem() {

    }

    function init() {
        PubSub.subscribe('event.add', addItem);
        PubSub.subscribe('event.remove', removeItem);
        PubSub.subscribe('event.get', getItem);
        PubSub.subscribe('event.update', updateItem);
        openDb()
    }

    return {
        init: init
    }
});