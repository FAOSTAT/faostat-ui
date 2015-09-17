/*global define*/

define([
    'jquery'
], function ($) {

    var defaultOptions = {};


    function Fx_Dashboard_Utils() {
        this.o = { };
    }


    Fx_Dashboard_Utils.prototype.findAndReplaceProperty = function(json, path, child, find, replace, lang) {
        // console.log('path ');
        path = path.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
        path = path.replace(/^\./, ''); // strip leading dot
        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in json) {
                json = json[n];
                if(a.length == 0){
                    var lbl = json[child][lang];
                    for (var prop in json) {delete json[prop]}
                    json[child] = lbl.replace(find,replace);
                }
            } else {
                return;
            }
        }
        return json;
    };

    Fx_Dashboard_Utils.prototype.setQueryFilters = function(data, params) {
        if (typeof data.filter != "undefined") {
            if(typeof data.filter[params.componentName] != "undefined"){
                data.filter[params.componentName].push(params);
            } else {
                data.filter[params.componentName] = [params];
            }
        } else {
            data.filter = {};
            data.filter[params.componentName] = [params];
        }

        return data;
    };


    Fx_Dashboard_Utils.prototype.init = function (options) {

        $.extend(this.o, defaultOptions);
        $.extend(this.o, options);

        return this;
    };

    return Fx_Dashboard_Utils;

});