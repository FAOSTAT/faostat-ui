/*global requirejs*/
requirejs(['../js/paths'], function (paths) {


    paths.baseUrl = '../js/';

    requirejs.config(paths);

    requirejs(['underscore',

		'pivot',
		"pivotRenderers",
		"pivotAggregators",
		
		'text!../tests/data/test.json',
		'../config/dataConfig1',
		
		'text!../tests/data/test2.json',

		'../config/dataConfig2'
		
		],
    function(_,

		pivot,
		pivotRenderers,
		pivotAggregators,

		dataTest1_1,
		dataConfig1, 
		dataTest1_2,
		dataConfig2

		 ) {
		
		 pp=new pivot();
	    dataTest1_1 = JSON.parse(dataTest1_1);
		dataTest1_2 = JSON.parse(dataTest1_2);
		
		dataConfig1 = _.extend(dataConfig1, {
			rendererDisplay: pivotRenderers,
			onDataLoaded: function(){
				console.log('onDataLoaded')
			}
		});

		dataConfig1 = _.extend(dataConfig1, {aggregatorDisplay: pivotAggregators });
		
		dataConfig2 = _.extend(dataConfig2, {
			rendererDisplay: pivotRenderers, 
			aggregatorDisplay: pivotAggregators
		});
		
		
		
		pp.render("pivot1",dataTest1_1, dataConfig1)
		//var pivot1 = pivot.render("pivot1",dataTest1_1, dataConfig1);
		

		pp2=new pivot();
		pp2.render("pivot2",dataTest1_2, dataConfig2);
		

	});
});

