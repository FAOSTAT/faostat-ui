define([
  'chaplin',
  'fx-dashboard/controllers/base/controller',
  'fx-dashboard/views/dashboard-view',
  'fx-dashboard/models/dashboard',
  'fx-dashboard/models/widget',
  'fx-dashboard/models/widgets-collection'
], function(Chaplin, Controller, DashboardView, Dashboard, Widget, WidgetsCollection) {
  'use strict';

  var DashboardController = Controller.extend({

    title: 'Dashboard',
   // historyURL : function(params) {
     //   if (params.id) {
      //      return "widgets/" + params.id;
      //  } else {
       //     return '';
      //  }
   // },

    initialize: function() {
      Controller.prototype.initialize.apply(this, arguments);
    },

    show : function(params) {

        if (!params.hasOwnProperty('config')) {
            throw 'Dashboard requires a JSON configuration!'
        }
        if (!params.hasOwnProperty('container')) {
            throw 'Dashboard requires a container!'
        }

        if (params.hasOwnProperty('title')) {
            this.title = params.title;
        }
        //IF json for Widgets collection needs to be loaded from a url
      // var widgets = new WidgetsCollection({
            // url: params.url,
      // });

          //Else Widgets loaded from a variable
          var widgets = new WidgetsCollection();

           var models = _.each(params.config.widgets,
            function(widg){
               widgets.models.push(new Widget(widg));
          });

          this.model = new Dashboard({widgets: widgets, title: this.title});
          this.view = new DashboardView({model : this.model, el: params.container});
      },



      bindEventListeners: function () {
          // ALL SUBSCRIBE EVENTS
          //amplify.subcribe('ss', fun)
      },

      unbindEventListeners: function () {
          // ALL UNSUBSCRIBE EVENTS
         // amplify.unsubcribe('ss')
      },



      dispose: function () {
          this.unbindEventListeners();
          Controller.prototype.dispose.call(this, arguments);

      }

  });

  return DashboardController;
});
