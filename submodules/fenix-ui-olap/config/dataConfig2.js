define({
	"rows": [
		"Element",
		"Area",
		"Item"
	],
	"cols": ["Year"],
	"vals": [
		"Value",
		"Flag"
	],
	"hiddenAttributes":[
		"AreaCode",
		"ElementCode",
		"ItemCode",
		"Unit",
		"Value",
		"Flag",
		"VarOrder1",
		"VarOrder2",
		"VarOrder3",
		"VarOrder4"
	]
	,"InstanceRenderers":[{label:"Table",func:"Table"},{label:"line chart",func:"line chart"}]
	,"InstanceAggregators":[{label:"Sum2",func:"Sum2"},{label:"Sum",func:"Sum"}],
	"showRender":true
});