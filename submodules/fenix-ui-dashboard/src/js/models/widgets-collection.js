define([
  'chaplin',
  'fx-dashboard/models/widget',
  'fx-dashboard/models/base/collection'
], function(Chaplin, Widget, Collection) {
  'use strict';

  var WidgetsCollection = Collection.extend({
      model: Widget,
      defaults: {
          display: 'list'
      },

      parse : function(response){
          //console.log("Parse ...");
          //console.log(response.widgets);
          return response.widgets;
      },
      /**Used when using a url for widgets collection loading initialize: function(attributes, options) {
          this.options = _.extend(this.defaults, attributes);
          this.url = this.options.url;
          Collection.prototype.initialize.apply(this, arguments);
      }  **/
      initialize: function(attributes, options) {
          this.options = _.extend(this.defaults, attributes);
          Collection.prototype.initialize.apply(this, arguments);
          var _that = this;
          _(this).bindAll('createModel');

          if (typeof  this.options.url != "undefined") {
          this.url = this.options.url;
       }

          _.each(this.options.source, this.createModel);

      },

      createModel: function(widget) {
          this.models.push(new Widget(widget))
      }

  });

  return WidgetsCollection;
});
