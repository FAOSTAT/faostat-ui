/*global define, amplify*/
define([
    'views/base/view',
    'globals/Common',
    'text!templates/404.hbs',
    'config/Events',
    'config/Analytics',
    'amplify'
], function (View, Common, template, E, A) {

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

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                $.extend(true, {}, A.error['404'], {
                    label: Common.getCurrentUrl()
                })
            );

        }

    });

    return NotFoundView;
});
