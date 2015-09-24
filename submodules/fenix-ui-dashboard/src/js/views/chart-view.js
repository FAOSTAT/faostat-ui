define([
    'amplify',
    'require',
    'jquery',
    'fx-dashboard/views/base/view',
    'text!fx-dashboard/templates/chart.hbs',
    'fx-dashboard/models/chart',
    'fx-c-c/start',
    'fx-dashboard/config/events',
   // 'fx-filter/start',
    'fx-filter/utils'
], function(amplify, require, $, View, template, Chart, ChartCreator, Events, FilterUtils) {
    'use strict';

    var ChartView = View.extend({
        template: template,

        model: Chart,

        defaults : {},

        initialize: function(attributes, options) {
            this.options = _.extend(this.defaults, attributes);
            _(this).bindAll('render');
            //_.bindAll(this);
           // _.bindAll.apply(_, [this].concat(_.functions(this)));
            View.prototype.initialize.apply(this, arguments);

            this.template = this.getTemplateFunction();
            this.chartCreator = new ChartCreator();
            this.model.id = this.model.attributes.id;

            //console.log("INITIALIZE FILTER UTILS ======================");
           // this.filterUtils = new FilterUtils();
           // console.log("INITIALIZE FILTER UTILS END ======================");
            var _this = this;

              amplify.subscribe(Events.CHART_READY, function (chart) {
                _this.onLoadComplete(chart);
             })
        },

        onLoadComplete : function(chart){
             this.chart = chart;

            amplify.publish(Events.REFRESH_GRID_ITEM, this.model);

        },

        redraw : function(){
             this.chartCreator.adapter.reflow();
        },

        render : function(){
            var _this = this;
            this.el = this.template(this.model.toJSON());

            this.model.fetch({
                success: function(response){
                  // console.log(response.toJSON());
                   // var data.selected =  response.toJSON();
                   // console.log("SELECTED DATA");
                   // console.log(data);
                    var selected_data = _this.model.filter;
                   // var selected_data = {"Item": [{ componentName: "Item", code: "310510", label: "NPK complex <=10kg"}, { componentName: "Item", code: "310430", label: "Potassium sulphate"}]};
                    var resource = {};
                   resource.original_data = response.toJSON();
                    //resource.metadata = data.metadata;

                    //console.log("SELECTED DATA");
                    //console.log(selected_data);

                    //console.log("response");
                    //console.log(response.toJSON);

                   // console.log("RESOURCE");
                    //console.log(resource);
                    /**
                     * 	[Object { componentName="Country", code="4", label="Algeria"}]
                     */

                   // console.log("THIS RESOURCE");
                  //console.log(resource);


                   var filterUtils = new FilterUtils();

                   // console.log("THIS FILTER UTILS");
                   // console.log(_this.filterUtils);
                   // FilterUtils.filterData(resource, selected_data);
                 //  console.log(resource);
                  //  var filtered = filterUtils.filterData({original_data: response.toJSON()}, selected_data);
                    var filtered = (filterUtils.filterData({original_data: response.toJSON()}, selected_data, false)).original_data;

                  //  console.log("=========================");
                  // console.log(filtered);


                                        _this.chartCreator.render({
                                            container: '#'+_this.model.attributes.id,
                                            model: filtered,//response.toJSON()
                                            seriesSubject: _this.model.config.seriesSubject,
                                            options: _this.model.config.options
                                        });
                }
            });

            return this;
        }



    });


    return ChartView;
});