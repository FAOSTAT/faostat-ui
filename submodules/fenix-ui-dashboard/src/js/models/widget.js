define([
  'chaplin',
  'fx-dashboard/models/base/model'

], function(Chaplin, Model) {
  'use strict';

  var WidgetModel = Model.extend({
    defaults: {
      name: '',
      title: 'Widget',
      type: 'chart'
     },

    // PARSE Needed if collection is loaded from url i.e. using fetch
    //  parse : function(response, options){
     //    if (options.collection) return response;
     //     return response.widgets[0];
     //},

      initialize: function(attributes, options) {
       this.options = _.extend(this.defaults, attributes);
       //_.bindAll(this);
       Model.prototype.initialize.apply(this, arguments);
      }
  });

  return WidgetModel;
});
