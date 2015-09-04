define([], function () {

    'use strict';

    function FAOSTATCommons() {

    }

    FAOSTATCommons.prototype.iso2faostat = function(lang) {
        switch (lang) {
            case 'fr': return 'F';
            case 'es': return 'S';
            default: return 'E';
        }
    };

    return new FAOSTATCommons();

});