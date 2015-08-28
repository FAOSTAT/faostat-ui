requirejs.config({
    baseUrl: '../',
    paths : {
        text: 'lib/text',
       
        //jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        jquery: "//fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min",

        jqueryui: "lib/jquery-ui-1.9.2.custom.min",
        //i18n: 'lib/jquery.i18n.properties-min',
        //jssc3: "lib/highlight/jssc3",
        //calendar: "lib/grid/calendar/calendar",
    //    calendar_utf8: "lib/grid/calendar/calendar-cn-utf8",
        gt_msg: "lib/grid/gt_msg_en",
        gt_msg_grid: "lib/grid/gt_grid_all",
        //fusioncharts: "grid/flashchart/fusioncharts/FusionCharts",        
       // configuration: "tests/configuration",
        pivot: "js/pivot",
		'highcharts': "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",
		'HPivot' :'//fenixapps.fao.org/repository/js/jbpivot/0.1.0-olap/jbpivot.min'
		
		,pivotRenderer:"js/rend/rendererers"
		
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
    shim: {jqueryui:{deps: ['jquery']},
        /*i18n : {deps: ['jquery']},
        calendar: {exports: 'Calendar'},
        calendar_utf8: {exports: 'Calendar'},*/
		'highcharts': ['jquery'],
        gt_msg: {deps: ['jquery']},
        gt_msg_grid: {deps: ['jquery','gt_msg']},
		"pivotRenderer":{deps: ["pivot"]},
        pivot: {
            deps: [
                'jquery','jqueryui',
				//'i18n',
				// 'jssc3',
				//'calendar',
				//'calendar_utf8',
				'gt_msg','gt_msg_grid',
                //'configuration',*/
				'HPivot'/*,'HPivot1','HPivot2','HPivot3','HPivot4','HPivot5','HPivot6'*/
				
            ]
        },
		'HPivot':['jquery','jqueryui'/*,'i18n'*/]/*,
		'HPivot1':['HPivot'],'HPivot2':['HPivot'],
		'HPivot3':['HPivot'],'HPivot4':['HPivot'],
		'HPivot5':['HPivot'],'HPivot6':['HPivot']     */
    }
});
require(['text!config/dataTest.json',
'text!config/dataTest2.json',
'text!config/dataConfig.json',
'pivot',
 'highcharts',
 "js/rend/function_rendererers", 
 "text!js/rend/rendererers.js"],
    function(
	dataTest1_1,
	dataTest1_2,
	dataConfig, 
	pivot,
	highcharts,
	function_rendererers,display_rendereres ) {
	
    dataTest1_1 = JSON.parse(dataTest1_1);
	dataTest1_2 = JSON.parse(dataTest1_2);
    dataConfig = JSON.parse(dataConfig);
	console.log(eval(display_rendereres))
dataConfig.renderer=function_rendererers;
dataConfig.rendererDisplay=eval(display_rendereres)
   // $("#fx-olap-ui").pivotUI(dataTest2, dataConfig);
 /*   console.log(dataTest1_1);
	console.log(dataTest1_2);*/
$("#pivot1").pivotFin(dataTest1_1, dataConfig,true,"en");
 $("#pivot2").pivotFin(dataTest1_2, dataConfig,true,"en2");

   });