/**
 * Created by andrey on 14.06.14.
 */
define(function(require){

    var PubSub = require('pubsub');
    var store;
    var DB_NAME = 'Calendar';
    var DB_VERSION = 3; 
    var DB_STORE_NAME = 'Events';
    var db;
    var database;

    function openDb() {
        console.log("Open database ...");
        var openDBpromise = new Promise(function(resolve, reject){
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onsuccess = function (evt) {
                // Better use "this" than "req" to get the result to avoid problems with
                // garbage collection.
                // db = req.result;
                db = this.result;
                db.onerror = function(event) {
                // Generic error handler for all errors targeted at this database's
                // requests!
                    console.error("Database error: " + event.target.errorCode);
                };
                console.log("Database opened");
                resolve(db);
            };
            req.onerror = function (evt) {
                reject(evt.target.errorCode);
            };

            req.onupgradeneeded = function (evt) {
                console.log("DB.onupgradeneeded");
                var dbObj = evt.currentTarget.result;
                var store;

                dbObj.deleteObjectStore(DB_STORE_NAME);
                store = dbObj.createObjectStore(DB_STORE_NAME, { keyPath: '_id' });

                store.createIndex('name', 'name', { unique: false });
                store.createIndex('date', 'date', { unique: false });
                store.createIndex('participants', 'participants', { unique: false });
                store.createIndex('description', 'description', { unique: false });
                resolve(dbObj);
            };
        });
        return openDBpromise;       
    }

    function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    function clearObjectStore(store_name) {
        var clearPromise = new Promise(function(resolve, reject){
            var store = getObjectStore(DB_STORE_NAME, 'readwrite');
            var req = store.clear();
            req.onsuccess = function(e) {
                resolve(e.target)
            };
            req.onerror = function(e) {
                reject(e);
            };
        });
    }

    // Basic CRUD
    // Value is a Primary Key

    database = {
        init: function() {
            openDb().then(populateDB);
        },
        addItem: function(value) {
            var addItemPromise = new Promise(function(resolve, reject){
                var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                var req = store.add(value);
                req.onsuccess = function (e) {
                    console.log("Insertion in DB successful");
                    resolve(e.target.result);
                };
            });
            return addItemPromise;
        },
        getItem: function(value) {
            var getItemPromise = new Promise(function(resolve, reject){
                 var store = getObjectStore(DB_STORE_NAME, 'readonly');
                var req = store.get(value);
                req.onsuccess = function(e) {
                    resolve(e.target.result);
                };
                req.onerror = function(e) {
                    reject(e);
                }
            });  
            return getItemPromise;          
        },
        removeItem: function(value) {
            var removeItemPromise = new Promise(function(resolve, reject){
                var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                var req = store.delete(value);

                req.onsuccess = function(e) {
                    resolve(e.target.result);
                };
                req.onerror = function(e) {
                    reject(e);
                };
            }); 
            return removeItemPromise;             
        },
        updateItem: function(value) {
            var updateItemPromise = new Promise(function(resolve, reject){
                var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                var req = store.put(value);

                req.onsuccess = function(e) {
                    resolve(e.target.result);
                };
                req.onerror = function(e) {
                    reject(e);
                };
            });
            return updateItemPromise;
        },
        searchByDate: function(dateStart, dateEnd) {

            var searchByDatePromise = new Promise(function(resolve, reject){
                var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                var index = store.index('date');
                var events = [];
                var boundDateRange = IDBKeyRange.bound(dateStart, dateEnd);

                index.openCursor(boundDateRange).onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        events.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        resolve(events);
                    }
                };
            });
            return searchByDatePromise;
        },
        search: function(value) {
            var searchPromise = new Promise(function(resolve, reject){
                var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                var dateIndex = store.index('date');
                var startDate = Date.now();
                var endDate = startDate + 3.15569e10;
                var boundDateRange = IDBKeyRange.bound(startDate,endDate);
                var events = [];

                dateIndex
                    .openCursor(boundDateRange)
                    .onsuccess = function(e) {
                        var cursor = e.target.result;
                        var pattet = new RegExp(value)
                        var evtObj;
                        if (cursor) {
                            evtObj = cursor.value;
                            if (evtObj['name'].match() || evtObj['description'].match()) {
                                events.push(evtObj);
                            }
                            cursor.continue();
                        }
                        else {
                            resolve(events);
                        }
                };
            });
            return searchPromise;           
        }
    };

    // Create some sample events

    function populateDB() {
        clearObjectStore(DB_STORE_NAME);
        var events = [{
            _id: new Date().getTime() + 1,
            name: 'Записаться к зубному',
            date: new Date(2014, 10, 10).getTime(),
            participants: 'Я',
            description: 'Записаться к зубному, чтобы выдрать зуб'
        },
        {
            _id: new Date().getTime() + 2,
            name: 'Сходить на вечеринку',
            date: new Date(2014, 11, 2).getTime(),
            participants: 'Я',
            description: 'Сходить на вечеринку к Эллис'
        },
        {
            _id: new Date().getTime() + 3,
            name: 'Продать дом',
            date: new Date(2014, 8, 1).getTime(),
            participants: 'Я',
            description: 'Чтобы продать дом, сначала нужно сделать межевание'
        },
        {
            _id: new Date().getTime() + 4,
            name: 'Сделать задание для школы Яндекс',
            date: new Date(2014, 7, 5).getTime(),
            participants: 'Я',
            description: 'Внимательно отнестись к выполнению'
        },
        {
            _id: new Date().getTime() + 5,
            name: 'Убраться в комнате',
            date: new Date(2014, 7, 4).getTime(),
            participants: 'Я',
            description: 'Убраться в комнате как можно раньше!'
        },
        {
            _id: new Date().getTime() + 6,
            name: 'Посетить психолога',
            date: new Date(2014, 7, 3).getTime(),
            participants: 'Мама',
            description: 'Посетить психолога для улучшения психического самочувствия'
        },
        {
            _id: new Date().getTime() + 7,
            name: 'Купить SSD диск',
            date: new Date(2014, 8, 15).getTime(),
            participants: 'Я',
            description: 'Найти подходящий и купить SSD диск'
        },
        {
            _id: new Date().getTime() + 8,
            name: 'Найти новую работу',
            date: new Date(2014, 8, 16).getTime(),
            participants: 'Я',
            description: 'Найти работу, которая будет мне нравится'
        }];
        events.forEach(function(value){
            database.addItem(value);
        });
    }
    return database;
});