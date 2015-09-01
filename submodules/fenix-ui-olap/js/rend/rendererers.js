define(['pivotRenderersFuncs'], function(pivotRenderersFuncs) {

    return {
        "Table": function(pvtData, opts) {
			
			var InternalID=opts.id+"_fx-olap-ui";
            if (navigator.appName.indexOf("Internet Explorer") != -1) {//yeah, he's using IE
                var badBrowser = (
                        /*navigator.appVersion.indexOf("MSIE 10")==-1 &&*/   //v9 is ok
                        navigator.appVersion.indexOf("MSIE 1") == -1//v10, 11, 12, etc. is fine too
                        );
							
                if (badBrowser) {
                    //navigate to error page
                    $("#" + InternalID+"_myGrid1_div").hide();
                    $("#" +  InternalID+"_fx-olap-graph-div").hide();
                    $("#" + InternalID+"_fx-olap-holder-div").show();
                    // $('#aggregator option[value="Sum"]').prop('selected', true);
                    return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);
                }
                else {
                    $("#" +  InternalID+"_myGrid1_div").show();
                    $("#" +  InternalID+"_fx-olap-graph-div").hide();
                    $("#" +  InternalID+"_fx-olap-holder-div").hide();
					pivotRenderersFuncs.newGrid(pvtData, opts);
                }
            }
            else {
                $("#" +  InternalID+"_myGrid1_div").show();
                $("#" +  InternalID+"_fx-olap-graph-div").hide();
                $("#" +  InternalID+"_fx-olap-holder-div").hide();
				pivotRenderersFuncs.newGrid(pvtData, opts);
            }
            // return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts)
        },
        "Table2": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").show();
            return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);
        },
        "Table Barchart": function(pvtData, opts) {
        /* $("#"+opts.id+"_myGrid1_div").hide();
         $("#"+opts.id+"_fx-olap-graph-div").hide();
         $("#"+opts.id+"_fx-olap-holder-div").show();
         */
         //TODO barchart move to pivotRenderersFuncs
         
		 var InternalID=opts.id+"_fx-olap-ui";
            $("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").show();
		 
        // return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);//.barchart();
          return $.fn.barchart(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts));//.barchart();
         
		 },
         "Heatmap": function(pvtData, opts) {
        /* $("#"+opts.id+"_myGrid1_div").hide();
         $("#"+opts.id+"_fx-olap-graph-div").hide();
         $("#"+opts.id+"_fx-olap-holder-div").show();
         return $(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts)).heatmap();*/
		 		 var InternalID=opts.id+"_fx-olap-ui";

			$("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").show();
		 
        // return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);//.barchart();
          return $.fn.heatmap(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts));//.barchart();
                 

		},
         "Row Heatmap": function(pvtData, opts) {
        /* $("#"+opts.id+"_myGrid1_div").hide();
         $("#"+opts.id+"_fx-olap-graph-div").hide();
         $("#"+opts.id+"_fx-olap-holder-div").show();
         return $(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts)).heatmap("rowheatmap");
       */ 
 var InternalID=opts.id+"_fx-olap-ui";

			$("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").show();
		 
        // return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);//.barchart();
          return $.fn.heatmap(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts),"rowheatmap");//.barchart();
            
	   },
         "Col Heatmap": function(pvtData, opts) {/*
         $("#"+opts.id+"_myGrid1_div").hide();
         $("#"+opts.id+"_fx-olap-graph-div").hide();
         $("#"+opts.id+"_fx-olap-holder-div").show();
         return $(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts)).heatmap("colheatmap");*/
         
		 var InternalID=opts.id+"_fx-olap-ui";

			$("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").show();
		 
        // return pivotRenderersFuncs.pivotTableRenderer(pvtData, opts);//.barchart();
          return $.fn.heatmap(pivotRenderersFuncs.pivotTableRenderer(pvtData, opts),"colheatmap");//.barchart();
       
		 },
        "barchart": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" +  InternalID+"_myGrid1_div").hide();
            $("#" + InternalID+"_fx-olap-holder-div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").show();
            pivotRenderersFuncs.barhightchart(pvtData, "#" +  InternalID+"_fx-olap-graph-div", "barchart");
        },
        "line chart": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").hide();
            $("#" + InternalID+"_fx-olap-graph-div").show();
            pivotRenderersFuncs.barhightchart(pvtData, "#" + InternalID+"_fx-olap-graph-div", "line");
        },
        "Area": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" + InternalID+"_myGrid1_div").hide();
            $("#" + InternalID+"_fx-olap-holder-div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").show();
            pivotRenderersFuncs.barhightchart(pvtData, "#" +  InternalID+"_fx-olap-graph-div", "area");
        },
        "Stacked barchart": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" +  InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").show();
            pivotRenderersFuncs.barhightchart(pvtData, "#" + InternalID+"_fx-olap-graph-div", "stackedColumn");
        },
        "OLAP": function(pvtData, opts) {
				var InternalID=opts.id+"_fx-olap-ui";
            $("#" + InternalID+"_myGrid1_div").hide();
            $("#" +  InternalID+"_fx-olap-holder-div").hide();
            $("#" +  InternalID+"_fx-olap-graph-div").show();
            pivotRenderersFuncs.HPivot(pvtData, "#" +  InternalID+"_fx-olap-graph-div");
        }
    };
});