define({
derivedAttributes: {
   "Month": function(mp){
   var matchMonth = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
   return "<span class=ordre>" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
   },
   "Indicator":function(mp)
   {return "<span class=ordre>" + mp["FertCode"] + "</span>"+mp["Item"]+" ("+mp["Unit"]+")";}
},
rows: ["Area", "Indicator", "Month"],
cols: ["Year"],
vals: ["Value", "Flag"],
hiddenAttributes:["Month2","Unit","Item","Value","Flag","FertCode"],
linkedAttributes:[],
"InstanceRenderers": [
        {label: "Grid", func: "Table"},
		{label: "Table", func: "Table2"},
		{label: "Table Barchart", func: "Table Barchart"},
		{label: "Heatmap", func: "Heatmap"},
		{label: "Row Heatmap", func: "Row Heatmap"},
		{label: "Col Heatmap", func: "Col Heatmap"}
    ],
	"InstanceAggregators": [
	      {label: "SOMME", func: "Sum2"},
	  {label: "Sum", func: "Sum"},
  
      
        {label: "Average", func: "Average"}
    ],
    "showAgg": false,
    "showRender": true,
    "showUnit":true,
    "showCode":true,
    "showFlags":true
});		 
//"NoRecords","RecordOrder","Domain Code","Domain","Country Code","Country","Element Code","Element","Item Code","Item","Year Code","Year","Unit","Value","Flag","Flag Description","Var1Order","Var2Order","Var3Order","Var4Order"