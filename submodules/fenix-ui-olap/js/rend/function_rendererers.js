

define([
	'highcharts',
	'gt_msg_grid'//,
//	'i18n!fx-pivot/nls/pivot'
	], function(
		highcharts,
		gt_msg_grid//,
	//	i18n
		) {

    return	{
        HPivot: function(pivotData, id) {
            var mydata = [];
            var myfield =
                    {
                        count: {agregateType: "count", groupType: "none", label: "Counts"},
                        sum: {field: 'Value', agregateType: "sum", groupType: "none", label: "Sum"},
                        average: {field: 'Value', agregateType: "average", groupType: "none", label: "Average",
                            formatter: function(V, f) {
                                var res = null;
                                if (typeof(V) === "number") {
                                    res = V.toFixed(2);
                                }
                                return res;
                            }
                        },
                        Unit: {field: 'Unit', sort: "asc", showAll: true, agregateType: "distinct", label: "Unit"},
                        Flag: {field: 'Flag', sort: "asc", showAll: true, agregateType: "distinct", label: "Flag"}
                    };
            for (i in pivotData.rowAttrs) {
                myfield[pivotData.rowAttrs[i]] = {field: pivotData.rowAttrs[i], sort: "asc", agregateType: "distinct", label: pivotData.rowAttrs[i]};//showAll: true,
            }
            for (i in pivotData.colAttrs) {
                myfield[pivotData.colAttrs[i]] = {field: pivotData.colAttrs[i], sort: "asc", agregateType: "distinct", label: pivotData.colAttrs[i]};//showAll: true,
            }
            for (var i in pivotData.tree) {
                var rowTemp = i.split("||");
                for (var k in pivotData.tree[i]) {
                    ft = {};
                    for (var j = 0; j < pivotData.rowAttrs.length; j++)
                    {
                        ft[pivotData.rowAttrs[j]] = rowTemp[j];
                    }
                    var colTemp = k.split("||");
                    for (var j = 0; j < pivotData.colAttrs.length; j++)
                    {
                        ft[pivotData.colAttrs[j]] = colTemp[j];
                    }

                    ft["Value"] = pivotData.tree[i][k].value()[0];
                    ft["Unit"] = pivotData.tree[i][k].value()[1];
                    ft["flag"] = pivotData.tree[i][k].value()[2];

                    mydata.push(ft);
                }
            }
            if (/*typeof HPivott !== 'undefined' 
             &&*/ typeof $(id).data('unc-jbPivot') !== 'undefined'
                    ) {

                $(id).data('unc-jbPivot').options.xfields = pivotData.rowAttrs;
                $(id).data('unc-jbPivot').options.yfields = pivotData.colAttrs;
                //$("#fx-olap-graph-div").data('unc-jbPivot')._create()
                $(id).data('unc-jbPivot').reset();
                $(id).data('unc-jbPivot').insertRecords(mydata);
                $(id).data('unc-jbPivot')._renderHtml();
            }
            else {
                $(id).jbPivot({
                    fields: myfield,
                    xfields: pivotData.rowAttrs,
                    yfields: pivotData.colAttrs,
                    zfields: ["sum", "Unit", "Flag"],
                    data: mydata,
                    copyright: false,
                    summary: true,
                    l_all: "All",
                    l_unused_fields: "Available fields",
                    InternalID: id
                }
                );
            }
        },
        pivotTableRenderer: function(pivotData, opts) {
            __hasProp = {}.hasOwnProperty;
            var aggregator, c, colAttrs, colKey, colKeys, defaults, i, j, r, result, rowAttrs, rowKey, rowKeys, spanSize, td, th, totalAggregator, tr, txt, val, x;
            defaults = {localeStrings: {totals: "Totals"}};
            opts = $.extend(defaults, opts);
            colAttrs = pivotData.colAttrs;
            rowAttrs = pivotData.rowAttrs;
            rowKeys = pivotData.getRowKeys();
            colKeys = pivotData.getColKeys();
            result = document.createElement("table");
            result.className = "pvtTable";
            spanSize = function(arr, i, j) {
                var len, noDraw, stop, x, _i, _j;
                if (i !== 0) {
                    noDraw = true;
                    for (x = _i = 0; 0 <= j ? _i <= j : _i >= j; x = 0 <= j ? ++_i : --_i)
                    {
                        if (arr[i - 1][x] !== arr[i][x]) {noDraw = false;}
                    }
                    if (noDraw) {return -1;}
                }
                len = 0;
                while (i + len < arr.length) {
                    stop = false;
                    for (x = _j = 0; 0 <= j ? _j <= j : _j >= j; x = 0 <= j ? ++_j : --_j) {
                        if (arr[i][x] !== arr[i + len][x]) {stop = true;}
                    }
                    if (stop) {break;}
                    len++;
                }
                return len;
            };
            for (j in colAttrs) {
                if (!__hasProp.call(colAttrs, j))
                    continue;
                c = colAttrs[j];
                tr = document.createElement("tr");
                if (parseInt(j) === 0 && rowAttrs.length !== 0) {
                    th = document.createElement("th");
                    th.setAttribute("colspan", rowAttrs.length);
                    th.setAttribute("rowspan", colAttrs.length);
                    tr.appendChild(th);
                }
                th = document.createElement("th");
                th.className = "pvtAxisLabel";
                th.textContent = c;
                tr.appendChild(th);
                for (i in colKeys) {
                    if (!__hasProp.call(colKeys, i))
                        continue;
                    colKey = colKeys[i];
                    x = spanSize(colKeys, parseInt(i), parseInt(j));
                    if (x !== -1) {
                        th = document.createElement("th");
                        th.className = "pvtColLabel";
                        //FIG th.textContent = colKey[j];
                        th.innerHTML = colKey[j];
                        th.setAttribute("colspan", x);
                        if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {th.setAttribute("rowspan", 2);}
                        tr.appendChild(th);
                    }
                }
                if (parseInt(j) === 0) {
                    th = document.createElement("th");
                    th.className = "pvtTotalLabel";
                    th.innerHTML = opts.localeStrings.totals;
                    th.setAttribute("rowspan", colAttrs.length + (rowAttrs.length === 0 ? 0 : 1));
                    tr.appendChild(th);
                }
                result.appendChild(tr);
            }
            if (rowAttrs.length !== 0) {
                tr = document.createElement("tr");
                for (i in rowAttrs) {
                    if (!__hasProp.call(rowAttrs, i))
                        continue;
                    r = rowAttrs[i];
                    th = document.createElement("th");
                    th.className = "pvtAxisLabel";
                    th.textContent = r;
                    tr.appendChild(th);
                }
                th = document.createElement("th");
                if (colAttrs.length === 0) {
                    th.className = "pvtTotalLabel";
                    th.innerHTML = opts.localeStrings.totals;
                }
                tr.appendChild(th);
                result.appendChild(tr);
            }
            for (i in rowKeys) {
                if (!__hasProp.call(rowKeys, i))
                    continue;
                rowKey = rowKeys[i];
                tr = document.createElement("tr");
                for (j in rowKey) {
                    if (!__hasProp.call(rowKey, j))
                        continue;
                    txt = rowKey[j];
                    x = spanSize(rowKeys, parseInt(i), parseInt(j));
                    if (x !== -1) {
                        th = document.createElement("th");
                        th.className = "pvtRowLabel";
                        th.innerHTML = txt;
                        th.setAttribute("rowspan", x);
                        if (parseInt(j) === rowAttrs.length - 1 && colAttrs.length !== 0) {th.setAttribute("colspan", 2);}
                        tr.appendChild(th);
                    }
                }
                for (j in colKeys) {
                    if (!__hasProp.call(colKeys, j))
                        continue;
                    colKey = colKeys[j];
                    aggregator = pivotData.getAggregator(rowKey, colKey);
                    val = aggregator.value();
                    td = document.createElement("td");
                    td.className = "pvtVal row" + i + " col" + j;
                    //V1	  
                    //td.innerHTML = aggregator.format(val);
                    if (val != null && val.length > 1){
                        var monInnerTemp = "<table width=\"100%\" ><tr><td width=\"34%\">" + val[0] + "</td>";
                        for (tt = 1; tt < val.length; tt++) {monInnerTemp += "<td  width=\"33%\">" + val[tt] + "</td>";}
                        monInnerTemp += "</tr></table>";
                        td.innerHTML = monInnerTemp;
                    } else {td.innerHTML = aggregator.format(val);}
                    /*try{
                     var monInnerTemp ="<table width=\"100%\" ><tr><td width=\"34%\">"+val[0]+"</td>";//aggregator.format(val);		
                     if(FAOSTATNEWOLAP.showUnits){monInnerTemp +="<td  width=\"33%\">"+val[1]+"</td>";}		
                     if(FAOSTATNEWOLAP.showFlags){monInnerTemp +="<td width=\"33%\">"+val[2]+"</td>";}		
                     monInnerTemp+="</tr></table>";		
                     td.innerHTML=monInnerTemp;		
                     }catch(er){monInnerTemp=aggregator.format(val);}
                     */

                    td.setAttribute("data-value", val);
                    tr.appendChild(td);
                }
                totalAggregator = pivotData.getAggregator(rowKey, []);
                val = totalAggregator.value();
                td = document.createElement("td");
                td.className = "pvtTotal rowTotal";
                // td.innerHTML = totalAggregator.format(val);
                if (val != null && val.length > 1){
                    var monInnerTemp = "<table width=\"100%\" ><tr><td width=\"34%\">" + val[0] + "</td>";
                    for (tt = 1; tt < val.length; tt++) {monInnerTemp += "<td  width=\"33%\">" + val[tt] + "</td>";}
                    monInnerTemp += "</tr></table>";
                    td.innerHTML = monInnerTemp;
                } else {td.innerHTML = totalAggregator.format(val);}

                td.setAttribute("data-value", val);
                td.setAttribute("data-for", "row" + i);
                tr.appendChild(td);
                result.appendChild(tr);
            }
            tr = document.createElement("tr");
            th = document.createElement("th");
            th.className = "pvtTotalLabel";
            th.innerHTML = opts.localeStrings.totals;
            th.setAttribute("colspan", rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
            tr.appendChild(th);
            for (j in colKeys) {
                if (!__hasProp.call(colKeys, j))
                    continue;
                colKey = colKeys[j];
                totalAggregator = pivotData.getAggregator([], colKey);
                val = totalAggregator.value();
                td = document.createElement("td");
                td.className = "pvtTotal colTotal";
                //td.innerHTML = totalAggregator.format(val);
                if (val != null && val.length > 1){
                    var monInnerTemp = "<table width=\"100%\" ><tr><td width=\"34%\">" + val[0] + "</td>";
                    for (tt = tt; tt < val.length; tt++) {monInnerTemp += "<td  width=\"33%\">" + val[tt] + "</td>";}
                    monInnerTemp += "</tr></table>";
                    td.innerHTML = monInnerTemp;
                } else {td.innerHTML = totalAggregator.format(val);}
                td.setAttribute("data-value", val);
                td.setAttribute("data-for", "col" + j);
                tr.appendChild(td);
            }
            totalAggregator = pivotData.getAggregator([], []);
            val = totalAggregator.value();
            td = document.createElement("td");
            td.className = "pvtGrandTotal";
            // td.innerHTML = totalAggregator.format(val);
            if (val != null && val.length > 1){
                var monInnerTemp = "<table width=\"100%\" ><tr><td width=\"34%\">" + val[0] + "</td>";
                for (tt = 1; tt < val.length; tt++) {monInnerTemp += "<td  width=\"33%\">" + val[tt] + "</td>";}
                monInnerTemp += "</tr></table>";
                td.innerHTML = monInnerTemp;
            } else {td.innerHTML = totalAggregator.format(val);}

            td.setAttribute("data-value", val);
            tr.appendChild(td);
            result.appendChild(tr);
            result.setAttribute("data-numrows", rowKeys.length);
            result.setAttribute("data-numcols", colKeys.length);
            return result;

        },
        barhightchart: function(r, id, scope) {
            var monXaxis = [];
            for (entry in r.colKeys)
            {
                monXaxis.push(r.colKeys[entry].toString().replace(/<span class=ordre>\d+<\/span>/g, "").replace(/\|\|/g, " X "));
            }

            var maSeries = [];
            if (r.colKeys.length > 0) {
                for (ligne in r.tree) {
                    var temp = {"name": ligne.replace(/<span class=ordre>\d+<\/span>/g, "").replace(/\|\|/g, " X "), "data": []};
                    for (col in r.colKeys) {
                        var coldInd = r.colKeys[col].join("||");//.replace(/[^a-zA-Z0-9 ]/g,"_");
                        if (r.tree[ligne][coldInd] != null)
                        {
                            if (r.tree[ligne][coldInd].value().length > 1) {
                                temp.data.push(r.tree[ligne][coldInd].value()[0]);

                            }
                            else {
                                temp.data.push(r.tree[ligne][coldInd].value())
                            }
                        }

                        else {
                            temp.data.push(null);
                        }
                        //temp.push(r.rowTotals[ligne].sum);
                        // r2d2.push([ligne,col,+r.tree[ligne][col].value()]);
                    }
                    maSeries.push(temp);
                }
            }
            else {/*
             for(ligne in r.rowTotals){
             var temp=ligne.split('||');
             if( r.rowTotals[ligne]!=null){temp.push(r.rowTotals[ligne].value());}
             else{temp.push( null);}
             r2d2.push(temp);
             }*/
            }


            /*  series: {
             cursor: 'pointer',
             point: {
             events: {
             click: function (e) {
             hs.htmlExpand(null, { pageOrigin: {x: e.pageX || e.clientX,y: e.pageY || e.clientY},
             headingText: this.series.name,
             maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
             this.y + ' visits',
             width: 200
             });
             }
             }
             },
             marker: {
             lineWidth: 1
             }
             },*/



            var commonJson = {title: {text: ' '},
                plotOptions: {
                    column: {pointPadding: 0.2, borderWidth: 0},
                    line: {connectNulls: false}
                },
                subtitle: {text: ''},
                xAxis: {categories: monXaxis, crosshair: true},
                yAxis: {min: 0/*,  title: {   text: 'Rainfall (mm)'  }*/},
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: maSeries
            };

            if (scope == "barchart") {
                commonJson.chart = {type: 'column'};
            }
            else if (scope == "line") {
                commonJson.plotLines = [];
            }
            else if (scope == "area") {
                commonJson.chart = {type: 'area'};
                commonJson.plotOptions = {area: {stacking: 'normal'}}
            }
            else if (scope == "stackedColumn") {
                commonJson.chart = {type: 'column'};
                commonJson.plotOptions = {column: {stacking: 'normal'}}
            }
            $(id).highcharts(commonJson);
        },
        newGrid: function(r, options) {
			
            var FAOSTATOLAPV3 = {};
			var id=options.id+ "_fx-olap-ui"
			var grouped = options.grouped;
            var r2d2 = [];
            $("#" + id + "_mesFlags").empty();
            for (var ligne in r.tree) {
                var temp = ligne.split('||');
				r.colKeys.sort();
                for (var col in r.colKeys) {
                    var coldInd = r.colKeys[col].join("||");//.replace(/[^a-zA-Z0-9]/g,"_")
                    if (r.tree[ligne][coldInd] != null) 
					{ 
				var ret=r.tree[ligne][coldInd].value()[0];
				if(options.showUnit){ret+=","+r.tree[ligne][coldInd].value()[1]}
			if(options.showFlags){ret+=","+r.tree[ligne][coldInd].value()[2]}

						//temp.push(r.tree[ligne][coldInd].value().join("><"));
					temp.push(ret);
					
					}
                    else {temp.push("");}
                }
                r2d2.push(temp);
            }
            var grid_demo_id = id + "_myGrid1";
            var dsOption = {fields: [], recordType: 'array', data: r2d2};

            var colsOption = [];
            for (var i in r.rowAttrs) {
                dsOption.fields.push({name: r.rowAttrs[i]});
                colsOption.push({id: r.rowAttrs[i], header: r.rowAttrs[i], frozen: true, grouped: grouped});
            }
            var reg = new RegExp("<span class=ordre>[0-9]*</span>", "g");
            var reg2 = new RegExp("<span class=ordre>[0-9]*</span><table class=\"innerCol\"><th>([0-9]+)</th><th>([^>]*)</th></table>", "g");

            for (var i in r.colKeys) {
                dsOption.fields.push({name: r.colKeys[i].toString().replace(/[^a-zA-Z0-9]/g, "_")});
               var montitle = "";
                for (var ii = 0; ii < r.colKeys[i].length; ii++) {
                    if (true || options.showCodes)
					{montitle += "<br>" + r.colKeys[i][ii].replace(reg2, "$2 ($1)")/*.replace(/[^a-zA-Z0-9]/g,"_")*/;}
                    else {montitle += "<br>" + r.colKeys[i][ii].replace(reg, "")/*.replace(/[^a-zA-Z0-9]/g,"_")*/;}
                }
                colsOption.push({id: r.colKeys[i].join("_").replace(/[^a-zA-Z0-9]/g, "_"),
				header: montitle,
				toolTip: true, toolTipWidth: 150});
            }

            var gridOption = {
                id: grid_demo_id,
                width: "100%", //"100%", // 700,
                height: "250", //"100%", // 330,
                container: grid_demo_id + "_div", //pvtRendererArea",//testinline2",//'',//myGrid1_div',//pivot_table',// 'gridbox',// $(".pvtRendererArea")[0],//
                replaceContainer: true,dataset: dsOption,resizable: false,
                columns: colsOption,pageSize: 15,
                pageSizeList: [15, 25, 50, 150],
                SigmaGridPath: 'grid/',
                toolbarContent: 'nav | goto | pagesize ', /*| mybutton |*/
                onMouseOver: function(value, record, cell, row, colNo, rowNo, columnObj, grid) {
                    if (columnObj && columnObj.toolTip) {grid.showCellToolTip(cell, columnObj.toolTipWidth);}
                    else {grid.hideCellToolTip();}
                },
                onMouseOut: function(value, record, cell, row, colNo, rowNo, columnObj, grid) {grid.hideCellToolTip();}
            };
            FAOSTATOLAPV3.mygrid = new Sigma.Grid(gridOption);
			
            Sigma.Grid.render(FAOSTATOLAPV3.mygrid)();
            document.getElementById('page_after').id = id + "_page_after"
            document.getElementById(id + '_page_after').innerHTML = "/" + FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;

            FAOSTATOLAPV3.mygrid.pageSizeSelect.onchange = function()
			{document.getElementById(id + '_page_after').innerHTML = "/" + FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;};
			
			
				/*
				//Now out of the pivot : connected throug the exposed function
            if (FAOSTATOLAPV3.grouped) {
                $("#" + id + "_myGrid1_div").prepend($("<br><label for=\""+id+"_chkTreeview\">"+i18n.TreeView+"</label><input checked onchange=\"pp2.changechkTreeview('"+id+"')\" type=\"checkbox\" id=\""+id+"_chkTreeview\">"));
            }
            else {
                 $("#" + id + "_myGrid1_div").prepend($("<br><label for=\"chkTreeview\">"+i18n.TreeView+"</label><input  onchange=\"changechkTreeview('"+id+"')\" type=\"checkbox\" id=\""+id+"_chkTreeview\">"));
            }*/
			  /*if (FAOSTATOLAPV3.grouped) {
                $("#" + id + "_mesFlags").html($("<br><label for=\""+id+"_chkTreeview\">Treeview/sorting columns</label><input checked onchange=\"changechkTreeview('"+id+"')\" type=\"checkbox\" id=\""+id+"_chkTreeview\">"));
            }
            else {
                $("#" + id + "mesFlags").html($("<br><label for=\"chkTreeview\">Treeview/Sorting columns</label><input  onchange=\"changechkTreeview('"+id+"')\" type=\"checkbox\" id=\""+id+"_chkTreeview\">"));
            }*/
            $("#nested_by").hide();
        }
    };
});



  