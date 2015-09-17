define([
    'chaplin',
    'fx-dashboard/models/widget'

], function(Chaplin, WidgetModel) {
    'use strict';

    var TableModel = WidgetModel.extend({
        defaults: {
            name: '',
            title: 'Table'
        },
        url: '',

        parse: function (response) {
            this.data = response
            return response;
        }
        ,
        initialize: function(attributes, options) {
            WidgetModel.prototype.initialize.apply(this, arguments);
            this.options = _.extend(this.defaults, attributes,  WidgetModel.prototype.defaults);
            //_.bindAll(this);
            this.url = this.options.url;
            //console.log("================= TABLE MODEL ============");
           // console.log(this.url);
        }
    });

    return TableModel;
});