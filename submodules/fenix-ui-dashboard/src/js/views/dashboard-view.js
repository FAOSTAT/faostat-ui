define([
    'jquery',
    'amplify',
    'fx-dashboard/views/base/view',
    'fx-dashboard/views/widgets-collection-view',
    'fx-dashboard/views/widget-view',
    'text!fx-dashboard/templates/dashboard.hbs',
    'fx-dashboard/lib/Fx-fluid-grid',
    'fx-dashboard/models/dashboard',
    'fx-dashboard/config/events'
], function($, amplify, View, WidgetsCollectionView, WidgetView, template, FluidGrid, Dashboard, Events) {
    'use strict';

    var DashboardView = View.extend({
        container: '#fx-dashboard-container',
        template: template,
        model: Dashboard,
        autoRender: true,
        events : {
        },
        defaults: {
            grid: '',
            css :{
                draggable: '.fx-catalog-modular-form-handler', //'.fx-dashboard-drag',
                item: '.fx-dashboard-grid-item',
                gutter: '.fx-dashboard-grid-gutter-sizer',
                columnWidth: '.fx-dashboard-grid-sizer'
            }
         },

        initialize: function(attributes, options) {
            this.options = _.extend(this.defaults, attributes);
            //bind(this);
            _(this).bindAll('refresh', 'resize', 'initializeGrid', 'render');
            
            View.prototype.initialize.apply(this, arguments);


            amplify.subscribe(Events.REFRESH_GRID_ITEM, this.refresh);
            amplify.subscribe(Events.RESIZE_GRID_ITEM, this.resize);

            this.template = this.getTemplateFunction();

            this.grid = new FluidGrid();


            this._widgetCollectionView = new WidgetsCollectionView({
                collection: this.model.widgets,
                childViewConstructor : WidgetView
            });

            //console.log("============ LISTEN TO EVENT =====================");
            amplify.subscribe(Events.WIDGET_COLLECTION_READY, this.initializeGrid);
        },

        render : function() {
           $(this.el).empty();
           $(this.el).append(this.template(this.model.toJSON()));

            this._widgetCollectionView.listSelector = this.container;
            this._widgetCollectionView.render();


           // console.log("============ LISTEN TO EVENT: when loading JSON from URL  =====================");
           // amplify.subscribe(Events.WIDGET_COLLECTION_READY, this.initializeGrid);

            return this;
        },

        initializeGrid : function() {
            //console.log("============ COLLECTION RENDERED");
           this.grid.init({
              //  container: document.querySelector('.packery'),
               container: document.querySelector(this.container),  //.packery
               drag: {
                    containment: this.listSelector,
                    handle: this.options.css.draggable
                },
                config: {
                    itemSelector: this.options.css.item,
                    gutter:  this.options.css.gutter//,
                   // columnWidth:  this.options.css.columnWidth
                }
            });

            this.grid.render();
       },

        resize : function(target) {
            this.grid.resize(target);
            this.grid.pckry.layout();
            amplify.publish(Events.GRID_ITEM_RE_SIZED, target);
        },

        refresh : function() {
             this.grid.pckry.layout();
        }
    });

    return DashboardView;
});