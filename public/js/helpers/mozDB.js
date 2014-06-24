deinfe(function () {

    var DB_NAME = 'Calendar';
    var DB_VERSION = 1; // Use a long long for this value (don't use a float)
    var DB_STORE_NAME = 'Events';
    var db;

    // Used to keep track of which view is displayed to avoid uselessly reloading it
    var current_view_pub_key;

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
                DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

            store.createIndex('biblioid', 'biblioid', { unique: true });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('year', 'year', { unique: false });
        };
    }

    /**
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
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


    /**
     * @param {IDBObjectStore=} store
     */
    function displayPubList(store) {
        console.log("displayPubList");

        if (typeof store == 'undefined')
            store = getObjectStore(DB_STORE_NAME, 'readonly');

        var pub_msg = $('#pub-msg');
        pub_msg.empty();
        var pub_list = $('#pub-list');
        pub_list.empty();
        // Resetting the iframe so that it doesn't display previous content
        newViewerFrame();

        var req;
        req = store.count();
        // Requests are executed in the order in which they were made against the
        // transaction, and their results are returned in the same order.
        // Thus the count text below will be displayed before the actual pub list
        // (not that it is algorithmically important in this case).
        req.onsuccess = function(evt) {
            pub_msg.append('<p>There are <strong>' + evt.target.result +
                '</strong> record(s) in the object store.</p>');
        };
        req.onerror = function(evt) {
            console.error("add error", this.error);
            displayActionFailure(this.error);
        };

        var i = 0;
        req = store.openCursor();
        req.onsuccess = function(evt) {
            var cursor = evt.target.result;

            // If the cursor is pointing at something, ask for the data
            if (cursor) {
                console.log("displayPubList cursor:", cursor);
                req = store.get(cursor.key);
                req.onsuccess = function (evt) {
                    var value = evt.target.result;
                    var list_item = $('<li>' +
                        '[' + cursor.key + '] ' +
                        '(biblioid: ' + value.biblioid + ') ' +
                        value.title +
                        '</li>');
                    if (value.year != null)
                        list_item.append(' - ' + value.year);

                    if (value.hasOwnProperty('blob') &&
                        typeof value.blob != 'undefined') {
                        var link = $('<a href="' + cursor.key + '">File</a>');
                        link.on('click', function() { return false; });
                        link.on('mouseenter', function(evt) {
                            setInViewer(evt.target.getAttribute('href')); });
                        list_item.append(' / ');
                        list_item.append(link);
                    } else {
                        list_item.append(" / No attached file");
                    }
                    pub_list.append(list_item);
                };

                // Move on to the next object in store
                cursor.continue();

                // This counter serves only to create distinct ids
                i++;
            } else {
                console.log("No more entries");
            }
        };
    }

    function addPublication(biblioid, title, year, blob) {
        console.log("addPublication arguments:", arguments);
        var obj = { biblioid: biblioid, title: title, year: year };
        if (typeof blob != 'undefined')
            obj.blob = blob;

        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req;
        try {
            req = store.add(obj);
        } catch (e) {
            if (e.name == 'DataCloneError')
                displayActionFailure("This engine doesn't know how to clone a Blob, " +
                    "use Firefox");
            throw e;
        }
        req.onsuccess = function (evt) {
            console.log("Insertion in DB successful");
            displayActionSuccess();
            displayPubList(store);
        };
        req.onerror = function() {
            console.error("addPublication error", this.error);
            displayActionFailure(this.error);
        };
    }

    /**
     * @param {string} biblioid
     */
    function deletePublicationFromBib(biblioid) {
        console.log("deletePublication:", arguments);
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.index('biblioid');
        req.get(biblioid).onsuccess = function(evt) {
            if (typeof evt.target.result == 'undefined') {
                displayActionFailure("No matching record found");
                return;
            }
            deletePublication(evt.target.result.id, store);
        };
        req.onerror = function (evt) {
            console.error("deletePublicationFromBib:", evt.target.errorCode);
        };
    }

    /**
     * @param {number} key
     * @param {IDBObjectStore=} store
     */
    function deletePublication(key, store) {
        console.log("deletePublication:", arguments);

        if (typeof store == 'undefined')
            store = getObjectStore(DB_STORE_NAME, 'readwrite');

        // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
        // the result of the Object Store Deletion Operation algorithm is
        // undefined, so it's not possible to know if some records were actually
        // deleted by looking at the request result.
        var req = store.get(key);
        req.onsuccess = function(evt) {
            var record = evt.target.result;
            console.log("record:", record);
            if (typeof record == 'undefined') {
                displayActionFailure("No matching record found");
                return;
            }
            // Warning: The exact same key used for creation needs to be passed for
            // the deletion. If the key was a Number for creation, then it needs to
            // be a Number for deletion.
            req = store.delete(key);
            req.onsuccess = function(evt) {
                console.log("evt:", evt);
                console.log("evt.target:", evt.target);
                console.log("evt.target.result:", evt.target.result);
                console.log("delete successful");
                displayActionSuccess("Deletion successful");
                displayPubList(store);
            };
            req.onerror = function (evt) {
                console.error("deletePublication:", evt.target.errorCode);
            };
        };
        req.onerror = function (evt) {
            console.error("deletePublication:", evt.target.errorCode);
        };
    }

    function displayActionSuccess(msg) {
        msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
        $('#msg').html('<span class="action-success">' + msg + '</span>');
    }
    function displayActionFailure(msg) {
        msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
        $('#msg').html('<span class="action-failure">' + msg + '</span>');
    }
    function resetActionStatus() {
        console.log("resetActionStatus ...");
        $('#msg').empty();
        console.log("resetActionStatus DONE");
    }

    function addEventListeners() {
        console.log("addEventListeners");

        $('#register-form-reset').click(function(evt) {
            resetActionStatus();
        });

        $('#add-button').click(function(evt) {
            console.log("add ...");
            var title = $('#pub-title').val();
            var biblioid = $('#pub-biblioid').val();
            if (!title || !biblioid) {
                displayActionFailure("Required field(s) missing");
                return;
            }
            var year = $('#pub-year').val();
            if (year != '') {
                // Better use Number.isInteger if the engine has EcmaScript 6
                if (isNaN(year))  {
                    displayActionFailure("Invalid year");
                    return;
                }
                year = Number(year);
            } else {
                year = null;
            }

            var file_input = $('#pub-file');
            var selected_file = file_input.get(0).files[0];
            console.log("selected_file:", selected_file);
            // Keeping a reference on how to reset the file input in the UI once we
            // have its value, but instead of doing that we rather use a "reset" type
            // input in the HTML form.
            //file_input.val(null);
            var file_url = $('#pub-file-url').val();
            if (selected_file) {
                addPublication(biblioid, title, year, selected_file);
            } else if (file_url) {
                addPublicationFromUrl(biblioid, title, year, file_url);
            } else {
                addPublication(biblioid, title, year);
            }

        });

        $('#delete-button').click(function(evt) {
            console.log("delete ...");
            var biblioid = $('#pub-biblioid-to-delete').val();
            var key = $('#key-to-delete').val();

            if (biblioid != '') {
                deletePublicationFromBib(biblioid);
            } else if (key != '') {
                // Better use Number.isInteger if the engine has EcmaScript 6
                if (key == '' || isNaN(key))  {
                    displayActionFailure("Invalid key");
                    return;
                }
                key = Number(key);
                deletePublication(key);
            }
        });

        $('#clear-store-button').click(function(evt) {
            clearObjectStore();
        });

        var search_button = $('#search-list-button');
        search_button.click(function(evt) {
            displayPubList();
        });

    }

    openDb();
    addEventListeners();

})();