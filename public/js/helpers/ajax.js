/**
 * Created by andrey on 22.06.14.
 */
"use strict"

define(function(){
    var AJAX = {};

    AJAX.get = function(url) {
        return request(url, 'GET', null)
    };
    AJAX.post = function(url, data, headers) {
        return request(url, 'POST', data, header)
    };
    AJAX.del = function(url, data, headers) {
        return request(url, 'DELETE', data, headers);
    };
    AJAX.put = function(url, data, headers) {
        return request(url, 'PUT', data, headers);
    };
    AJAX.getJSON = function(url) {
        return AJAX.get(url).then(JSON.parse);
    };
    AJAX.postJSON = function(url, data) {
        var data = JSON.stringify(data);
        return AJAX.post(url, data, {'Content-Type': 'application/json'})
    };
    function request(url, type, data, headers) {
        var xhr = new XMLHttpRequest();
        var promise = new Promise(function(resolve, reject) {
            xhr.open(type, url, true);
            if (headers && typeof headers === 'object') {
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader('' + header, headers[header]);
                    }
                }
            }
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onload = function(data){
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                }
                else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = reject;
            xhr.send(data);
        });
        return promise;
    }
    return AJAX;
});