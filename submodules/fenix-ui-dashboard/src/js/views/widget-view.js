define([
    'amplify',
    'chaplin',
    'jquery',
    'require',
    'fx-dashboard/views/base/view',
    'text!fx-dashboard/templates/widget.hbs',
    'fx-dashboard/models/widget',
    'fx-dashboard/models/chart',
    'fx-dashboard/views/chart-view',
    'fx-dashboard/config/events'
], function(amplify, Chaplin, $, require, View, template, Widget, ChartModel, ChartView, Events) {
    'use strict';

    var WidgetView = View.extend({

        template: template,

        model: Widget,
        childView: ChartView,

        defaults: {
            widgetModel: ChartModel,
            html:'',
            css: {
              'RESIZE': '.fx-catalog-modular-form-resize-btn'//'.fx-dashboard-resize-btn'
            }
        },

        initialize: function(attributes, options) {
            this.options = _.extend(this.defaults, attributes);
            //_.bindAll(this);
            View.prototype.initialize.apply(this, arguments);

            this.template = this.getTemplateFunction();

            this._widgetTypeModel = "fx-dashboard/models/"+this.model.attributes.type;
            this._widgetTypeView = "fx-dashboard/views/"+this.model.attributes.type+"-view";

            this.resize = this.delegate('click', '#'+this.model.id + ' '+this.options.css.RESIZE, this.expandView);

        },

        render : function(){
            this.el = $(this.template(this.model.toJSON()));
            var _that = this;

            require([this._widgetTypeModel, this._widgetTypeView], function(WidgetTypeModel, WidgetTypeView){
                _that._widgetTypeModel = new WidgetTypeModel;
                _that._widgetTypeModel.attributes.id = _that.model.attributes.type +'-'+_that.model.id;
                _that._widgetTypeModel.url = _that.model.attributes.url;
                _that._widgetTypeModel.config = _that.model.attributes.config;
                _that._widgetTypeModel.filter = _that.model.attributes.filter;

                _that.childView = new WidgetTypeView({model : _that._widgetTypeModel, grid: _that.options.grid});

                _that.renderChild(_that.childView);
            });
        },

        renderChild : function(childView){
            this.childView = childView;
            $(this.el).append(this.childView.render().el);
        },



        expandView: function(){
            var $widget = $('#'+this.model.id);
            var isGigante =  $widget.hasClass('fit');
            $widget.toggleClass('fit');

            if(isGigante){
                $('#'+this.model.id+' '+this.options.css.RESIZE).css({
                    "background-position": "-30px 0"
                });

           } else {
                $('#'+this.model.id+ ' '+this.options.css.RESIZE).css({
                    "background-position": "-30px -15px"
                });
           }

            amplify.publish(Events.RESIZE_GRID_ITEM, this.model.id);
         }

    });


    return WidgetView;
});