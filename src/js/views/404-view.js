/*global define, amplify*/
define([
    'views/base/view',
    'globals/Common',
    'config/Routes',
    'text!templates/404.hbs',
    'config/Events',
    'amplify'
], function (View, Common, ROUTE, template, E) {

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

            //Common.changeURL(ROUTE.HOME, [], true);

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: '404'});

        }

    });

    return NotFoundView;
});
