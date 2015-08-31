define([
    'chaplin',
    'fx-dashboard/models/widget'

], function(Chaplin, WidgetModel) {
    'use strict';

    var ChartModel = WidgetModel.extend({
       defaults: {
            name: '',
            title: 'Chart',
            type: 'highchart'
        },
        url: '',
        id: '',
        config: {},
        filter: {},

        parse: function (response) {
          this.data = response
          return response;
        }
        ,
        initialize: function(attributes, options) {
            WidgetModel.prototype.initialize.apply(this, arguments);
            this.options = _.extend(this.defaults, attributes,  WidgetModel.prototype.defaults);
            //_.bindAll(this);
           // _.bindAll.apply(_, [this].concat(_.functions(this)));
            //console.log(this.options);
            this.url = this.options.url;
         }
    });

    return ChartModel;
});