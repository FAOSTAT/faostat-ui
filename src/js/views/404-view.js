/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/404.hbs',
    'config/Events',
    'amplify'
], function (View, template, E) {

    'use strict';

    var NotFoundView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: '404',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: '404'});

        }
    });

    return NotFoundView;
});
