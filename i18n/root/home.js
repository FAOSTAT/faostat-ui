/*global define*/
define([
    'jquery',
    'i18n!nls/common'
], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        "home_welcome_title" : "Welcome to " + Common["project_name"],
        "text" : "Change me in i18n/root/home.js",
        "authentication_credentials" : "login username/password: guest@fenix/guest"

    });

});