/*global define*/
define(['chaplin'], function (Chaplin) {

    'use strict';

    function Common() {

        return this;
    }

    Common.prototype.changeURL = function (name , options, reload) {

        var reload = reload || false;

        if (reload) {

            // TODO: how to handle?

        }else {

            var url = Chaplin.utils.reverse(
                name, options
            );

            // TODO: Use Chaplin 'route' function
            console.warn('TODO: change Backbone binding');
            Backbone.history.navigate(url, {trigger:false});
        }
    };

    return new Common();

});
