requirejs.config(
{
           locale: 'fr-fr'
        ,
    baseUrl: '../',
    paths : {
		'text': "//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text",
		'i18n': "//fenixapps.fao.org/repository/js/requirejs/plugins/i18n/2.0.4/i18n",
		
		'domready': "//fenixapps.fao.org/repository/js/requirejs/plugins/domready/2.0.1/domReady",
		'underscore': "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
        'jquery': "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",

        jqueryui: "lib/jquery-ui-1.9.2.custom.min",
        //i18n: 'lib/jquery.i18n.properties-min',
        //jssc3: "lib/highlight/jssc3",
        //calendar: "lib/grid/calendar/calendar",
		//calendar_utf8: "lib/grid/calendar/calendar-cn-utf8",
        gt_msg: "lib/grid/gt_msg_en",
        gt_msg_grid: "lib/grid/gt_grid_all",
        //fusioncharts: "grid/flashchart/fusioncharts/FusionCharts",        
       // configuration: "tests/configuration",
        pivot: "js/pivot",
		'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",
		'HPivot' :'//fenixapps.fao.org/repository/js/jbpivot/0.1.0-olap/jbpivot.min',
		
		pivotRenderersFuncs: 'js/rend/function_rendererers',
		pivotRenderers:      'js/rend/rendererers',
		pivotAggregatorsFuncs: 'js/rend/function_aggregators',
		pivotAggregators:      'js/rend/aggregators',
		
		/*PROD*/
				/*
DEV
				'HPivot' :'lib/HierachicalRender/pivot',

		'HPivot1':'lib/HierachicalRender/agregate_average',
		'HPivot2':'lib/HierachicalRender/agregate_count',
		'HPivot3':'lib/HierachicalRender/agregate_distinct',
		'HPivot4':'lib/HierachicalRender/agregate_sum',
		'HPivot5':'lib/HierachicalRender/formatter_default',
		'HPivot6':'lib/HierachicalRender/group_distinct'*/
    },
    shim: {
    	jqueryui: ['jquery'],
        /*calendar: {exports: 'Calendar'},
        calendar_utf8: {exports: 'Calendar'},*/
		highcharts:  ['jquery'],
        gt_msg:      ['jquery'],
        gt_msg_grid: ['jquery','gt_msg'],
		
        pivotRenderers: ['pivotRenderersFuncs'],	
		pivotAggregators: ['pivotAggregatorsFuncs','jquery'],			
        pivot: {
            deps: [
                'jquery',
                'jqueryui',
				//'jssc3',
				//'calendar',
				//'calendar_utf8',
				'gt_msg','gt_msg_grid',
                //'configuration',*/
				'HPivot',/*'HPivot1','HPivot2','HPivot3','HPivot4','HPivot5','HPivot6'*/
				'pivotRenderers'
            ]
        },
		HPivot: ['jquery','jqueryui']
		/*,
		'HPivot1':['HPivot'],'HPivot2':['HPivot'],
		'HPivot3':['HPivot'],'HPivot4':['HPivot'],
		'HPivot5':['HPivot'],'HPivot6':['HPivot']     */
    }
});
require(['jquery','underscore',
		'pivot',
		"pivotRenderers",
		"pivotAggregators",
		'text!tests/data/test.json',
		'config/dataConfig1',
		'text!tests/data/test2.json',
		'config/dataConfig2'
		
		],
    function($, _,
		pivot,
		pivotRenderers,
		pivotAggregators,
		dataTest1_1,
		dataConfig1, 
		dataTest1_2,
		dataConfig2 
		 ) {
		
		
	    dataTest1_1 = JSON.parse(dataTest1_1);
		dataTest1_2 = JSON.parse(dataTest1_2);
		
		dataConfig1 = _.extend(dataConfig1, {rendererDisplay: pivotRenderers});
		dataConfig1 = _.extend(dataConfig1, {aggregatorDisplay: pivotAggregators});
		
		dataConfig2 = _.extend(dataConfig2, {rendererDisplay: pivotRenderers});
		dataConfig2 = _.extend(dataConfig2, {aggregatorDisplay: pivotAggregators});
		
		console.log(dataConfig1,dataConfig2)
		
		 pp=new pivot();
		pp.render("pivot1",dataTest1_1, dataConfig1)
		//var pivot1 = pivot.render("pivot1",dataTest1_1, dataConfig1);
		
		
		pp2=new pivot();
		pp2.render("pivot2",dataTest1_2, dataConfig2);
		console.log(pp,pp2)

});