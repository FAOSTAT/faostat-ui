define([
    'jquery',
    'fx-dashboard/views/base/view',
    'text!fx-dashboard/templates/map.hbs',
    'fx-dashboard/models/map'
], function($, View, template, Map) {
    'use strict';

    var MapView = View.extend({
        template: template,
        events     : {
        },
        model: Map,

        defaults : {},

        initialize: function(attributes, options) {
            this.options = _.extend(this.defaults, attributes);
          //  _.bindAll(this);
            View.prototype.initialize.apply(this, arguments);
        },

        render : function(){
            var template = this.getTemplateFunction();
            var html = template(this.model.toJSON());
            //console.log("In Map View "+ this.model.attributes.title);
            $(this.el).append(template(this.model.toJSON()) );

            return this;
        }

    });


    return MapView;
});