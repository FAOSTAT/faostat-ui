define([
    "require",
    "jquery"
], function (require, $) {

    var templates = {};
    var WidgetManager = {

        get: function(type, callback){
        var template = templates;

        var model = "fx-dashboard/models/"+type;
        var view = "fx-dashboard/views/"+type+"-view";

        var that = this;
        require([model, view], function(Model, View){
            templates["model"] = Model;
            templates["view"] = View;
            return callback(Model);
        });

      }
    }

   return WidgetManager;

});









