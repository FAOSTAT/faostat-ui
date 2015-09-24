define([
  'chaplin',
  'fx-dashboard/models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Dashboard = Model.extend({
    defaults: {
      layout: {}
    },//,

      initialize: function(attributes, options) {
          this.options = _.extend(this.defaults, attributes);
          //_.bindAll(this);
          Model.prototype.initialize.apply(this, arguments);
          this.widgets = this.options.widgets;
          this.title = this.options.title;
      }
  });

  return Dashboard;
});
