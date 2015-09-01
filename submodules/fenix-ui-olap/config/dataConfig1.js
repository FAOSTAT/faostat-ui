define({
	"rows": [
		
		["Area","AreaCode"],
		["Item","ItemCode"],"Year"
	],
	"cols": [["Element","ElementCode"]],
	"vals": ["Value",
		"Flag"],
	"hiddenAttributes":[
		
		
		
		"Unit",
		"Value",
		"Flag",
		"VarOrder1",
		"VarOrder2",
		"VarOrder3",
		"VarOrder4"
	],
	linkedAttributes:[["Element","ElementCode"]	,["Area","AreaCode"],["Item","ItemCode"]],
	derivedAttributes:{},
	"InstanceRenderers":[{label:"Grid",func:"Table"},{label:"Table",func:"Table2"},{label:"HTable",func:"OLAP"}]
	,"InstanceAggregators":[{label:"SOMME",func:"Sum2"},{label:"Sum",func:"Sum"},{label:"Average",func:"Average"}]
	,"showAgg":true,
	"showRender":true,
	"showUnit":true,
	"showFlags":true,
	"showCode":false
});		