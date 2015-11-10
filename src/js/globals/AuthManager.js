/*global define*/
define([
    'fx-common/AuthManager'
], function (FXAuthManager) {

    'use strict';

    function AuthManager() {

        return this;
    }

    AuthManager.prototype.init = function (opts) {

        this.authManager = new FXAuthManager(opts);
        return this;
    };

    AuthManager.prototype.isLogged = function () {

        return this.authManager.isLogged();
    };

    return new AuthManager();
});