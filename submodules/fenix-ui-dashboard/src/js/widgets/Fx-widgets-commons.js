/*global define */

define(function () {

    var o = {
        sessionStorage: {
            interface: {
                lang: "fenix.interface.lang"
            }
        }
    }

    function Fx_Commons() {
    }

    //Dispatch an event for Chrome, Firefox e IE
    Fx_Commons.prototype.raiseCustomEvent = function (item, type, data) {

        var self = this;

        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(type, true, true, data);
        if (self.isNode(item)) {
            item.dispatchEvent(evt);
        }

    };

    //Returns true if it is a DOM node
    Fx_Commons.prototype.isNode = function (o) {
        return ( typeof Node === "object" ? o instanceof Node :
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string" );
    };

    //Returns true if it is a DOM element
    Fx_Commons.prototype.isElement = function (o) {
        return ( typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string" );
    };

    //Raise an error
    Fx_Commons.prototype.handleError = function (c, err) {

        if (err.hasOwnProperty(c)) {
            throw new Error({ code: c, error: err[c] });
        }

    };

    //Getter and Setter for session cache
    Fx_Commons.prototype.getCacheItem = function (key) {

        return sessionStorage.getItem(key);
        ;

    };

    Fx_Commons.prototype.setCacheItem = function (key, value) {

        var self = this;
        sessionStorage.setItem(key, value);
        return self.getLang();

    };

    //Getter and Setter for lang setting within interface
    Fx_Commons.prototype.getLang = function () {

        var self = this;

        return self.getCacheItem(o.sessionStorage.interface.lang) ?
            self.getCacheItem(o.sessionStorage.interface.lang).toUpperCase() : null;

    };

    Fx_Commons.prototype.setLang = function (lang) {

        var self = this;
        self.setCacheItem(o.sessionStorage.interface.lang, lang.toUpperCase());
        return self.getLang();

    };

    //Load a CSS file dynamically
    Fx_Commons.prototype.loadCss = function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    Fx_Commons.prototype.getFenixUniqueId = function () {
        window.fx_dynamic_id_counter > -1 ? window.fx_dynamic_id_counter++ : window.fx_dynamic_id_counter = 0;
        return window.fx_dynamic_id_counter;
    }

    return Fx_Commons;

});