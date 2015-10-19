define([
	'jquery','jquery-ui',
	'i18n!fx-olap/nls/pivot'], function($, ui, i18n) {

    var $, PivotData, addSeparators, aggregatorTemplates, aggregators, dayNamesEn, derivers, locales, mthNamesEn, naturalSort, numberFormat, pivotTableRenderer, renderers, usFmt, usFmtInt, usFmtPct, zeroPad,
            __indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item)
                return i;
        }
        return -1;
    },
            __slice = [].slice,
            __bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    },
            __hasProp = {}.hasOwnProperty,
            originalData, myinputOpts;
    myinputOpts = {grouped: true,originalOpts:{}}
    locales = {
        en2: {
//aggregators: aggregators,
            localeStrings: i18n
        },
        en: {
//aggregators: aggregators2,
            localeStrings: i18n
        }
    };

    mthNamesEn = i18n.months;
    dayNamesEn = i18n.days;
    zeroPad = function(number) {
        return ("0" + number).substr(-2, 2);
    };

    derivers = {
        bin: function(col, binWidth) {
            return function(record) {
                return record[col] - record[col] % binWidth;
            };
        },
        dateFormat: function(col, formatString, mthNames, dayNames) {
            if (mthNames == null) {
                mthNames = mthNamesEn;
            }
            if (dayNames == null) {
                dayNames = dayNamesEn;
            }
            return function(record) {
                var date;
                date = new Date(Date.parse(record[col]));
                if (isNaN(date)) {
                    return "";
                }
                return formatString.replace(/%(.)/g, function(m, p) {
                    switch (p) {
                        case "y":
                            return date.getFullYear();
                        case "m":
                            return zeroPad(date.getMonth() + 1);
                        case "n":
                            return mthNames[date.getMonth()];
                        case "d":
                            return zeroPad(date.getDate());
                        case "w":
                            return dayNames[date.getDay()];
                        case "x":
                            return date.getDay();
                        case "H":
                            return zeroPad(date.getHours());
                        case "M":
                            return zeroPad(date.getMinutes());
                        case "S":
                            return zeroPad(date.getSeconds());
                        default:
                            return "%" + p;
                    }
                });
            };
        }
    };

    naturalSort = (function(_this) {
        return function(as, bs) {
            var a, a1, b, b1, rd, rx, rz;
            rx = /(\d+)|(\D+)/g;
            rd = /\d/;
            rz = /^0/;
            if (typeof as === "number" || typeof bs === "number") {
                if (isNaN(as)) {
                    return 1;
                }
                if (isNaN(bs)) {
                    return -1;
                }
                return as - bs;
            }
            a = String(as).toLowerCase();
            b = String(bs).toLowerCase();
            if (a === b) {
                return 0;
            }
            if (!(rd.test(a) && rd.test(b))) {
                return (a > b ? 1 : -1);
            }
            a = a.match(rx);
            b = b.match(rx);
            while (a.length && b.length) {
                a1 = a.shift();
                b1 = b.shift();
                if (a1 !== b1) {
                    if (rd.test(a1) && rd.test(b1)) {
                        return a1.replace(rz, ".0") - b1.replace(rz, ".0");
                    }
                    else {
                        return (a1 > b1 ? 1 : -1);
                    }
                }
            }
            return a.length - b.length;
        };
    })(this);

    $.pivotUtilities = {
        aggregatorTemplates: aggregatorTemplates,
        aggregators: aggregators,
        renderers: renderers,
        derivers: derivers,
        locales: locales,
        naturalSort: naturalSort,
        numberFormat: numberFormat
    };

    function stringify(obj) {
        var type = Object.prototype.toString.call(obj);
        // IE8 <= 8 does not have array map
        var map = Array.prototype.map || function map(callback) {
            var ret = [];
            for (var i = 0; i < this.length; i++) {
                ret.push(callback(this[i]));
            }
            return ret;
        };
        if (type === '[object Object]') {
            var pairs = [];
            for (var k in obj) {
                if (!obj.hasOwnProperty(k))
                    continue;
                pairs.push([k, stringify(obj[k])]);
            }
            pairs.sort(function(a, b) {
                return a[0] < b[0] ? -1 : 1
            });
            pairs = map.call(pairs, function(v) {
                if (v[0] != "format" && v[0] != "push" && v[0] != "value") {
                    return '"' + v[0].replace(/"/g, "\\\"") + '":' + v[1];
                }
                else {
                    return '"' + v[0].replace(/"/g, "\\\"") + '":""';
                }
            }
            );
            return '{' + pairs + '}';
        }
        if (type === '[object Array]') {
            return '[' + map.call(obj, function(v) {
                return stringify(v)
            }) + ']';
        }
        return JSON.stringify(obj);
    }
    ;






    /*
     Data Model class
     */

    PivotData = (function() {
        function PivotData(input, opts) {
            this.getAggregator = __bind(this.getAggregator, this);
            this.getRowKeys = __bind(this.getRowKeys, this);
            this.getColKeys = __bind(this.getColKeys, this);

            this.sortKeys = __bind(this.sortKeys, this);
            this.arrSort = __bind(this.arrSort, this);
            this.natSort = __bind(this.natSort, this);
            this.aggregator = opts.aggregator;
            this.aggregatorName = opts.aggregatorName;
            this.colAttrs = opts.cols;
            this.rowAttrs = opts.rows;
            this.valAttrs = opts.vals;
            this.tree = {};

            this.rowKeys = [];
            this.colKeys = [];
            this.rowTotals = {};
            this.colTotals = {};
            this.allTotal = this.aggregator(this, [], []);
            this.sorted = false;
            PivotData.forEachRecord(input, opts.derivedAttributes, (function(_this) {
                return function(record) {
                    if (opts.filter(record)) {
                        return _this.processRecord(record);
                    }
                };
            })(this));
        }

        PivotData.forEachRecord = function(input, derivedAttributes, f) {
            var addRecord, compactRecord, i, j, k, record, tblCols, _i, _len, _ref, _results, _results1;
            if ($.isEmptyObject(derivedAttributes)) {
                addRecord = f;
            } else {
                addRecord = function(record) {
                    var k, v, _ref;
                    for (k in derivedAttributes) {
                        v = derivedAttributes[k];
                        record[k] = (_ref = v(record)) != null ? _ref : record[k];
                    }
                    return f(record);
                };
            }
            if ($.isFunction(input)) {
                return input(addRecord);
            }
            else if ($.isArray(input)) {
                if ($.isArray(input[0])) {
                    _results = [];
                    for (i in input) {
                        if (!__hasProp.call(input, i))
                            continue;
                        compactRecord = input[i];
                        if (!(i > 0)) {
                            continue;
                        }
                        record = {};
                        _ref = input[0];
                        for (j in _ref) {
                            if (!__hasProp.call(_ref, j))
                                continue;
                            k = _ref[j];
                            record[k] = compactRecord[j];
                        }
                        _results.push(addRecord(record));
                    }
                    return _results;
                } else {
                    _results1 = [];
                    for (_i = 0, _len = input.length; _i < _len; _i++) {
                        record = input[_i];
                        _results1.push(addRecord(record));
                    }
                    return _results1;
                }
            } else if (input instanceof jQuery) {
                tblCols = [];
                $("thead > tr > th", input).each(function(i) {
                    return tblCols.push($(this).text());
                });
                return $("tbody > tr", input).each(function(i) {
                    record = {};
                    $("td", this).each(function(j) {
                        return record[tblCols[j]] = $(this).text();
                    });
                    return addRecord(record);
                });
            } else {
                throw new Error("unknown input format");
            }
        };

        PivotData.convertToArray = function(input) {
            var result;
            result = [];
            PivotData.forEachRecord(input, {}, function(record) {
                return result.push(record);
            });
            return result;
        };

        PivotData.prototype.natSort = function(as, bs) {
            return naturalSort(as, bs);
        };

        PivotData.prototype.arrSort = function(a, b) {
            return this.natSort(a.join(), b.join());
        };

        PivotData.prototype.sortKeys = function() {
            if (!this.sorted) {
                this.rowKeys.sort(this.arrSort);
                this.colKeys.sort(this.arrSort);
            }
            return this.sorted = true;
        };



        PivotData.prototype.getColKeys = function() {
            this.sortKeys();
            return this.colKeys;
        };

        PivotData.prototype.getRowKeys = function() {
            this.sortKeys();
            return this.rowKeys;
        };

        PivotData.prototype.processRecord = function(record) {
            var colKey, flatColKey, flatRowKey, rowKey, x, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
            colKey = [];
            rowKey = [];
            _ref = this.colAttrs;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                x = _ref[_i];
                colKey.push((_ref1 = record[x]) != null ? _ref1 : "null");
            }
            _ref2 = this.rowAttrs;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                x = _ref2[_j];
                rowKey.push((_ref3 = record[x]) != null ? _ref3 : "null");
            }
            /*FIG MODIF  flatRowKey = rowKey.join(String.fromCharCode(0));
             flatColKey = colKey.join(String.fromCharCode(0));*/
            flatRowKey = rowKey.join("||");
            flatColKey = colKey.join("||");
            this.allTotal.push(record);
            if (rowKey.length !== 0) {
                if (!this.rowTotals[flatRowKey]) {
                    this.rowKeys.push(rowKey);
                    this.rowTotals[flatRowKey] = this.aggregator(this, rowKey, []);
                }
                this.rowTotals[flatRowKey].push(record);
            }
            if (colKey.length !== 0) {
                if (!this.colTotals[flatColKey]) {
                    this.colKeys.push(colKey);
                    this.colTotals[flatColKey] = this.aggregator(this, [], colKey);
                }
                this.colTotals[flatColKey].push(record);
            }
            if (colKey.length !== 0 && rowKey.length !== 0) {
                if (!this.tree[flatRowKey]) {
                    this.tree[flatRowKey] = {};
                }
                if (!this.tree[flatRowKey][flatColKey]) {
                    this.tree[flatRowKey][flatColKey] = this.aggregator(this, rowKey, colKey);
                }
                return this.tree[flatRowKey][flatColKey].push(record);
            }
        };

        PivotData.prototype.getAggregator = function(rowKey, colKey) {
            var agg, flatColKey, flatRowKey;
            /*flatRowKey = rowKey.join(String.fromCharCode(0));
             flatColKey = colKey.join(String.fromCharCode(0));*/
            flatRowKey = rowKey.join("||");
            flatColKey = colKey.join("||");
            if (rowKey.length === 0 && colKey.length === 0)
            {
                agg = this.allTotal;
            }
            else if (rowKey.length === 0)
            {
                agg = this.colTotals[flatColKey];
            }
            else if (colKey.length === 0)
            {
                agg = this.rowTotals[flatRowKey];
            }
            else {
                agg = this.tree[flatRowKey][flatColKey];
            }

            return agg != null ? agg : {value: (function() {
                    return null;
                }), format: function() {
                    return "";
                }};
        };
        return PivotData;
    })();

    /*
     Default Renderer for hierarchical table layout
     */
    /*
     Pivot Table core: create PivotData object and call Renderer on it
     */



    $.fn.pivot = function(input, opts) {
	var defaults, e, pivotData, result, x, internalData;
	var InternalID = opts.rendererOptions.id;
        defaults = {
            cols: [], rows: [],
            filter: function() {
                return true;
            },
            //aggregator: aggregatorTemplates.count()(),
            //aggregatorName: "Count",derivedAttributes: {},
            renderer: pivotTableRenderer,
            rendererOptions: null,
            localeStrings: locales.en.localeStrings
        };
	
        opts = $.extend({}, defaults, opts);
        result = null;
        r2 = new PivotData(input, opts);


       

        /* FAOSTATNEWOLAP.internalData = new PivotData(input, opts);
         result = opts.renderer(FAOSTATNEWOLAP.internalData, opts.rendererOptions);
		 */

        result = opts.renderer(new PivotData(input, opts), opts.rendererOptions);

        x = this[0];
        try {
            while (x.hasChildNodes()) {
                x.removeChild(x.lastChild);
            }
        }
        catch (er) {        }
     
        $("#" + InternalID).data("internalData", r2);
        $("#" + InternalID + "_fx-olap-ui_fx-olap-holder-div").html(result);
        
         if($.isFunction(opts.onDataLoaded) && typeof this.onDataLoadedExecuted === 'undefined')
            {
                opts.onDataLoaded();
                this.onDataLoadedExecuted = true;
            }
    };

    var destroy = function() {$("#" + this.myinputOpts.id + " .tooff").off();}

  





    var changechkTreeview = function() {
        this.myinputOpts.grouped = !this.myinputOpts.grouped;
        $("#" + this.myinputOpts.id + "_fx-olap-ui").pivotUI(this.originalData, this.myinputOpts, true);
    }

    var exportExcel = function() {
				
        var FID = $("#" + this.myinputOpts.id).data().internalData;
        var mycols = [];
        for (var c = 0; c < FID.rowAttrs.length; c++){mycols.push(FID.rowAttrs[c] + "Name");}
        flatColKeyst = [];
        tt = FID.getColKeys();
        for (tti in tt) {flatColKeyst.push(tt[tti].join("||"));}
        document.getElementById("myJson").value = stringify(
                {data: FID.tree,
                    header: flatColKeyst, cols: mycols, swUnit: this.myinputOpts.showUnit ? '1' : '0', swFlag: this.myinputOpts.showFlags ? '1' : '0'

                });

        document.getElementById("xlsDataForm").submit();

    }

	
	var showCode=function(param){
		this.myinputOpts.showCode=param;
			this.myinputOpts.originalOpts.showCode=param;
		this.render(this.InternalID, this.originalData,  this.myinputOpts.originalOpts,true)
		}
		
		var showUnit=function(param){
		this.myinputOpts.showUnit=param;
		this.myinputOpts.originalOpts.showUnit=param;
		this.render(this.InternalID, this.originalData,  this.myinputOpts.originalOpts,true)
		}
		
		var showFlags=function(param){
		this.myinputOpts.showFlags=param;
		this.myinputOpts.originalOpts.showFlags=param;
		this.render(this.InternalID, this.originalData,  this.myinputOpts.originalOpts,true)
		}
		
		
    var exportCSV = function() {
        var today = new Date();
        var reg = new RegExp("<span class=ordre>[0-9]+</span>", "g");
        var reg3 = new RegExp("<span class=ordre></span>", "g");
        var reg2 = new RegExp("<table class=\"innerCol\"><th>([0-9]+)</th><th>([^>]*)</th></table>", "g");
        var FID = $("#" + this.myinputOpts.id).data().internalData;
        var row = FID.tree;
        //  var col = FAOSTATNEWOLAP.internalData.flatColKeys.sort();
        flatColKeyst = [];
        tt = FID.getColKeys();
        for (tti in tt) {
            flatColKeyst.push(tt[tti].join("||"))
        }
        var col = flatColKeyst.sort();
        var ret = "";
        for (var j = 0; j < FID.rowKeys[0].length; j++) {
          /*  if (showCodes) {
                ret += "Code,";
            }*/
            ret += '"' + FID.rowAttrs[j].replace("_", "") + "\",";
        }

        for (var j in col) {
            ret += '"' + col[j].replace(/,/g, "").replace(/\|\|/g, "-").replace(/&nbsp;/g, "").replace(reg2, "$1").replace(reg, "").replace(reg3, "") + '"';
            if (this.myinputOpts.showUnit) {ret += ",unit";}
            if (this.myinputOpts.showFlags) {ret += ",flag";}
            if(j<col.length-1){ret += ",";}
        }
        ret += "\n";
        for (var i in row) {
            var temp = i.split("||");
            for (var count = 0; count < temp.length; count++)
            {
                ret += '"' + temp[count].replace(/,/g, "").replace(reg2, "$1\",\"$2").replace(reg, "").replace(reg3, "") + "\",";
            }
            for (j in col) {
                try {
                    if (!row[i][col[j]]) {
                        ret += ",";
                        if (this.myinputOpts.showUnit) {
                            ret += ",";
                        }
                        if (this.myinputOpts.showFlags) {
                            ret += ",";
                        }
                    }
                    else {
                        // ret += '"' + addCommas(row[i][col[j]].value()[0]) + '",';
                        ret += '"' + row[i][col[j]].value()[0] + '"';
                        if (this.myinputOpts.showUnit) {
                            ret += ',"' + /*addCommas(*/row[i][col[j]].value()[1]/*)*/ + '"';
                        }
                        if (this.myinputOpts.showFlags) {
                            ret += ',"' + /*addCommas(*/row[i][col[j]].value()[2]/*)*/ + '"';
                        }
						if(j<col.length-1){ret += ",";}
                    }
                } catch (ER) {console.log('er', ER);}
            }
            ret += "\n";
        }
        try {
            var testtd = document.getElementById("hor-minimalist-b").getElementsByTagName('td');
            j = 0;
            for (i = 0; i < testtd.length; i++) {
                if (j == 0) {ret += "\n";j = 1;}
                else {ret += ",";j = 0;}
                ret += testtd[i].innerHTML;
            }
        } catch (e) {console.log("WS getFlag not available");}
		
        ret += "\n\n "+this.myinputOpts.csvText +","+ today.getFullYear() + ", Date : " + today.toLocaleDateString() + "\n";
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var blob = new Blob(["\ufeff", ret], {type: 'text/csv;charset=UTF-8;'});
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "fileName.csv");
            link.style = "visibility:hidden";
        }
        else if (navigator.msSaveBlob) { // IE 10+
            link.addEventListener("click", function(event) {
                var blob = new Blob(["\ufeff", ret], {"type": "text/csv;charset=UTF-8;"});
                navigator.msSaveBlob(blob, "fileName.csv");
            }, false);
        }
        else {
            document.getElementById('csvData').value = ret;
            document.getElementById('csvDataForm').submit();
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



/*
function derivedAtt(el,code){;f= function(mp) {return mp[el]+" "+mp[code];}
return f
}*/

    var render = function(ii, input, inputOpts, overwrite, locale) {
		
        this.InternalID = ii;
		this.myinputOpts.originalOpts=inputOpts;
        this.myinputOpts = $.extend({}, this.myinputOpts, inputOpts);

        this.myinputOpts.id = ii;
        this.originalData = input;
		var rowtemp=[];
		var coltemp=[];
		for(var j=0;j<this.myinputOpts.rows.length;j++)
		{
			if(Array.isArray(inputOpts.rows[j]))
			{
				
			if(this.myinputOpts.showCode==true){
				rowtemp.push(this.myinputOpts.rows[j][0]);
				
				rowtemp.push(this.myinputOpts.rows[j][1])
				//this.myinputOpts.rows[j]=this.myinputOpts.rows[j][0]+"__Code";
			}
			else{
					rowtemp.push(this.myinputOpts.rows[j][0]);
				this.myinputOpts.hiddenAttributes.push(this.myinputOpts.rows[j][1]);
				//this.myinputOpts.rows[j]=this.myinputOpts.rows[j][0];
				}
			
			
			}else{rowtemp.push(this.myinputOpts.rows[j])}
			
		}
		this.myinputOpts.rows=rowtemp;
		for(var j=0;j<this.myinputOpts.cols.length;j++)
		{
			if(Array.isArray(this.myinputOpts.cols[j]))
			{
				
			if(inputOpts.showCode){
				coltemp.push(this.myinputOpts.cols[j][0]);
				
				coltemp.push(this.myinputOpts.cols[j][1])
				//this.myinputOpts.rows[j]=this.myinputOpts.rows[j][0]+"__Code";
			}
			else{
				coltemp.push(this.myinputOpts.cols[j][0]);
				this.myinputOpts.hiddenAttributes.push(this.myinputOpts.rows[j][1])
				//this.myinputOpts.rows[j]=this.myinputOpts.rows[j][0];
				}
			
			
			}else{coltemp.push(this.myinputOpts.cols[j])}
			
		}
		this.myinputOpts.cols=coltemp;
		
		
        document.getElementById(ii).innerHTML = "<div id='" + ii + "_fx-olap-ui'></div>" +
                "<div id='" + ii + "_fx-olap-ui_fx-olap-holder-div' style='overflow:auto'></div>" +
                "<div id='" + ii + "_fx-olap-ui_myGrid1_div' ></div>" +
                "<div id='" + ii + "_fx-olap-ui_fx-olap-graph-div'></div>" +
                "<div id='" + ii + "_fx-olap-ui_mesFlags' style='clear:both'></div>"
				
				;

        ret = $("#" + ii + "_fx-olap-ui").pivotUI(input, this.myinputOpts, overwrite, locale);
		//$("#" + ii + "_fx-olap-ui").attr("class","fx-olap-holder");
        return ret;
    }


    $.fn.pivotUI = function(input, inputOpts, overwrite, locale) {

        var a, aggregator, attrLength, axisValues, c, colList, defaults, e, existingOpts, i, initialRender, k, opts, pivotTable, refresh, refreshDelayed, renderer, rendererControl, shownAttributes, tblCols, tr1, tr2, uiTable, unusedAttrsVerticalAutoOverride, x, _fn, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, InternalID;
        if (overwrite == null) {
            overwrite = false;
        }
        if (locale == null) {
            locale = "en";
        }

        //this.myinputOpts=inputOpts;
        //this.myinputOpts.id/*InternalID*/ = this.attr('id');
        InternalID = inputOpts.id;

        defaults = {
            derivedAttributes: {}, renderers: {}, aggregators: {},
            //aggregators: locales[locale].aggregators,
            //aggregators: inputOpts.aggregatorDisplay,
            //renderers: locales[locale].renderers,
            //renderers: inputOpts.rendererDisplay,

            hiddenAttributes: [], menuLimit: 500,
            cols: [], rows: [], vals: [], exclusions: {}, // "auto",
            unusedAttrsVertical: false, autoSortUnusedAttrs: false,
            rendererOptions: {localeStrings: locales[locale].localeStrings, id: inputOpts.id, grouped: inputOpts.grouped/*options.grouped*/,showFlags:inputOpts.showFlags,showUnit:inputOpts.showUnit,showCode:inputOpts.showCode},
            onRefresh: null, filter: function() {
                return true;
            },
            localeStrings: locales[locale].localeStrings
        };

        if (inputOpts.InstanceRenderers == null) {
            defaults.renderers = inputOpts.rendererDisplay
        }
        else {
            for (i = 0; i < inputOpts.InstanceRenderers.length; i++) {
                defaults.renderers[inputOpts.InstanceRenderers[i].label] = inputOpts.rendererDisplay[inputOpts.InstanceRenderers[i].func];
            }
        }
		
		/**/
		/* defaults.renderers["Table Barchart"]= function(pvtData, opts) {
      return $(pivotTableRenderer(pvtData, opts)).barchart();
    };
     defaults.renderers["Heatmap"]= function(pvtData, opts) {
      return $(pivotTableRenderer(pvtData, opts)).heatmap();
    };
     defaults.renderers["Row Heatmap"]=function(pvtData, opts) {
      return $(pivotTableRenderer(pvtData, opts)).heatmap("rowheatmap");
    };
     defaults.renderers["Col Heatmap"]= function(pvtData, opts) {
      return $(pivotTableRenderer(pvtData, opts)).heatmap("colheatmap");
    }*/
		/**/
		
        if (inputOpts.InstanceAggregators == null) {
            defaults.aggregators = inputOpts.aggregatorDisplay
        }
        else {
            for (i = 0; i < inputOpts.InstanceAggregators.length; i++) {
                defaults.aggregators[inputOpts.InstanceAggregators[i].label] = inputOpts.aggregatorDisplay[inputOpts.InstanceAggregators[i].func];
            }
        }
        existingOpts = this.data("pivotUIOptions");
        if ((existingOpts == null) || overwrite)
        {//to check   opts = $.extend(defaults, inputOpts);
            opts = $.extend({}, defaults, inputOpts);
        }
        else {
            opts = existingOpts;
        }
        //try 

        input = PivotData.convertToArray(input);
        tblCols = (function() {
            var _ref, _results;
            _ref = input[0];
            _results = [];
            for (k in _ref) {
                if (!__hasProp.call(_ref, k))
                    continue;
                _results.push(k);
            }
            return _results;
        })();
        _ref = opts.derivedAttributes;
        for (c in _ref) {
            if (!__hasProp.call(_ref, c))
                continue;
            if ((__indexOf.call(tblCols, c) < 0)) {
                tblCols.push(c);
            }
        }
        axisValues = {};
        for (_i = 0, _len = tblCols.length; _i < _len; _i++) {
            x = tblCols[_i];
            axisValues[x] = {};
        }
        PivotData.forEachRecord(input, opts.derivedAttributes, function(record) {
            var v, _base, _results;
            _results = [];
            for (k in record) {
                if (!__hasProp.call(record, k))
                    continue;
                v = record[k];
                if (!(opts.filter(record))) {
                    continue;
                }
                if (v == null) {
                    v = "null";
                }
                if ((_base = axisValues[k])[v] == null) {
                    _base[v] = 0;
                }
                _results.push(axisValues[k][v]++);
            }
            return _results;
        });
        uiTable = $("<table cellpadding='5'>");
        rendererControl = $("<td id='" + inputOpts.id + "_vals'>");//class='pvtAxisContainer pvtUnused'
        renderer = $("<select id='" + inputOpts.id + "_renderer' class='pvtRenderer tooff'>").appendTo(rendererControl).on("change", function() {
            return refresh();
        });
		if (inputOpts.showRender!=true){renderer.addClass("invi");}
        _ref1 = opts.renderers;
        for (x in _ref1) {
            if (!__hasProp.call(_ref1, x))
                continue;
            $("<option>").val(x).html(x).appendTo(renderer);
        }
        colList = $("<td id='" + inputOpts.id + "_unused' class='pvtAxisContainer '>");
       
		if (inputOpts.showAgg==true){colList.addClass("pvtUnused");}
		else{colList.addClass("pvtUnusedInvi");}
		//pvtUnused
	//if (inputOpts.showAgg==false){$()}		
        shownAttributes = (function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = tblCols.length; _j < _len1; _j++) {
                c = tblCols[_j];
                _results.push(c);
            }
            return _results;
        })();
        unusedAttrsVerticalAutoOverride = false;
        if (opts.unusedAttrsVertical === "auto") {
            attrLength = 0;
            for (_j = 0, _len1 = shownAttributes.length; _j < _len1; _j++) {
                a = shownAttributes[_j];
                attrLength += a.length;
            }
            unusedAttrsVerticalAutoOverride = attrLength > 120;
        }
        if (opts.unusedAttrsVertical === true || unusedAttrsVerticalAutoOverride) {
            colList.addClass('pvtVertList');
        }
        else {
            colList.addClass('pvtHorizList');
        }
        _fn = function(c) {
            var attrElem, btns, checkContainer, filterItem, filterItemExcluded, hasExcludedItem, keys, showFilterList, triangleLink, updateFilter, v, valueList, _k, _len2, _ref2;
            keys = (function() {
                var _results;
                _results = [];
                for (k in axisValues[c]) {
                    _results.push(k);
                }
                return _results;
            })();
            hasExcludedItem = false;
            valueList = $("<div>").addClass('pvtFilterBox').hide();
            valueList.append($("<h4>").text("" + c + " (" + keys.length + ")"));
            if (keys.length > opts.menuLimit) {
                valueList.append($("<p>").html(i18n.tooMany));
            }
            else {
                btns = $("<p>").appendTo(valueList);
                btns.append(
                        $("<button class=\"tooff\">").html(i18n.selectAll).on("click", function() {
                    return valueList.find("input:visible").prop("checked", true);
                })
                        );
                btns.append($("<button  class=\"tooff\">").html(i18n.selectNone).on("click", function() {
                    return valueList.find("input:visible").prop("checked", false);
                }));
                btns.append($("<input class=\"tooff\">").addClass("pvtSearch").attr("placeholder", opts.localeStrings.filterResults).on("keyup", function() {
                    var filter;
                    filter = $(this).val().toLowerCase();
                    return $(this).parents(".pvtFilterBox").find('label >span').each(function() {
                        var testString;
                        testString = $(this).text().toLowerCase().indexOf(filter);
                        if (testString !== -1) {
                            return $(this).parent().show();
                        }
                        else {
                            return $(this).parent().hide();
                        }
                    });
                }));
                checkContainer = $("<div>").addClass("pvtCheckContainer").appendTo(valueList);
                _ref2 = keys.sort(naturalSort);
                for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                    k = _ref2[_k];
                    v = axisValues[c][k];
                    filterItem = $("<label class='pvtFilterLabel'>");
                    filterItemExcluded = opts.exclusions[c] ? (__indexOf.call(opts.exclusions[c], k) >= 0) : false;
                    hasExcludedItem || (hasExcludedItem = filterItemExcluded);
                    $("<input type='checkbox' class='pvtFilter'>").attr("checked", !filterItemExcluded).data("filter", [c, k]).appendTo(filterItem);
                    filterItem.append($("<span>").html("" + k + " (" + v + ")"));
                    checkContainer.append($("<p>").append(filterItem));
                }
            }
            updateFilter = function() {
                var unselectedCount;
                unselectedCount = $(valueList).find("[type='checkbox']").length - $(valueList).find("[type='checkbox']:checked").length;
                if (unselectedCount > 0) {
                    attrElem.addClass("pvtFilteredAttribute");
                }
                else {
                    attrElem.removeClass("pvtFilteredAttribute");
                }
                if (keys.length > opts.menuLimit) {
                    return valueList.toggle();
                }
                else {
                    return valueList.toggle(0, refresh);
                }
            };
            $("<p>").appendTo(valueList).append($("<button class=\"tooff\">").text("ok").on("click", updateFilter));
            showFilterList = function(e) {
			
                valueList.css({
                    left: 300, // e.pageX,
                    top:0// e.screenY
                }).toggle();
                $('.pvtSearch').val('');
                return $('label').show();
            };
            triangleLink = $("<span class='pvtTriangle tooff'>").html(" &#x25BE;").on("click", showFilterList);
            if (__indexOf.call(opts.hiddenAttributes, c) < 0) {
                attrElem = $("<li class='axis_" + i + " tooff' id='" + InternalID + "_filtre_" + c + "'>").append($("<span class='pvtAttr'>").html(c).data("attrName", c).append(triangleLink));
            }
            else {
                attrElem = $("<li class='axis_" + i + " invi' id='" + InternalID + "_filtre_" + c + "'>").append($("<span class='pvtAttr'>").html(c).data("attrName", c).append(triangleLink));
            }
            if (hasExcludedItem) {
                attrElem.addClass('pvtFilteredAttribute');
            }
            colList.append(attrElem);
			attrElem.append(valueList);
			//console.log(valueList.html())
            //$("body").append(attrElem).append(valueList);
            return attrElem.on("dblclick", showFilterList);
        };
        for (i in shownAttributes) {
            c = shownAttributes[i];
            _fn(c);
        }
        tr1 = $("<tr>").appendTo(uiTable);
        aggregator = $("<select  id='" + InternalID + "_aggregator' class='pvtAggregator tooff'>").on("change", function() {
            return refresh();
        });
		if (inputOpts.showAgg!=true){aggregator.addClass("invi");}

        _ref2 = opts.aggregators;
        for (x in _ref2) {
            if (!__hasProp.call(_ref2, x))
                continue;
            aggregator.append($("<option>").val(x).html(x));
        }
        $("<td id='" + InternalID + "_cols' class='pvtAxisContainer pvtHorizList pvtCols'>").appendTo(tr1);
        $("<td class='pvtVals'>").appendTo(uiTable).append(aggregator).append($("<br>"));
        tr2 = $("<tr>").appendTo(uiTable);
        // tr2.append($("<td id='rows' valign='top' class='pvtAxisContainer pvtRows pvtHorizList'>"));
        // tr2.append($("<td id=" +InternalID + "_pretd1>"));
        // pivotTable = $("<td valign='top' id='pvtRendererArea' class='pvtRendererArea'>").append("<div  id='pivot_table'>").appendTo(tr2);

        $("#" + InternalID + "_fx-olap-holder-div").empty();
        pivotTable = $("<td valign='top' id='" + InternalID + "_pvtRendererArea' class='pvtRendererArea'>").append("<div  id='" + InternalID + "_pivot_table'>").appendTo($("#" + InternalID + "_fx-olap-holder-div"));

        if (opts.unusedAttrsVertical === true || unusedAttrsVerticalAutoOverride) {
            uiTable.find('tr:nth-child(1)').prepend(colList);
            uiTable.find('tr:nth-child(2)').prepend(rendererControl);
        } else {
            uiTable.prepend($("<tr>").append($("<td id='" + InternalID + "_rows' valign='top' class='pvtAxisContainer pvtRows pvtHorizList'>")));
            uiTable.prepend($("<tr>").append(colList));
            uiTable.prepend($("<tr>").append(rendererControl));
        }

        //$("#fx-olap-holder-div").html(uiTable);
        this.html(uiTable);
        _ref3 = opts.cols;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            x = _ref3[_k];
            this.find(".pvtCols").append(this.find(".axis_" + (shownAttributes.indexOf(x))));
        }
        _ref4 = opts.rows;
        for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
            x = _ref4[_l];
            this.find(".pvtRows").append(this.find(".axis_" + (shownAttributes.indexOf(x))));
        }
        if (opts.aggregatorName != null) {
            this.find(".pvtAggregator").val(opts.aggregatorName);
        }
        if (opts.rendererName != null) {
            this.find(".pvtRenderer").val(opts.rendererName);
        }
        initialRender = true;
        refreshDelayed = (function(_this) {
		
            return function() {
                var attr, exclusions, natSort, newDropdown, numInputsToProcess, pivotUIOptions, pvtVals, subopts, unusedAttrsContainer, vals, _len4, _m, _n, _ref5;
                subopts = {
                    derivedAttributes: opts.derivedAttributes,
                    localeStrings: opts.localeStrings,
                    rendererOptions: opts.rendererOptions,
                    cols: [], rows: [],
                   onDataLoaded:opts.onDataLoaded
                };

//myOnDataLoaded
               
                numInputsToProcess = (_ref5 = opts.aggregators[aggregator.val()]([])().numInputs) != null ? _ref5 : 0;
                vals = [];
                _this.find(".pvtRows li span.pvtAttr").each(function()
                {
                    return subopts.rows.push($(this).data("attrName"));
                });

                _this.find(".pvtCols li span.pvtAttr").each(function()
                {
                    return subopts.cols.push($(this).data("attrName"));
                });

                _this.find(".pvtVals select.pvtAttrDropdown").each(function() {
                    if (numInputsToProcess === 0) {
                        return $(this).remove();
                    }
                    else {
                        numInputsToProcess--;
                        if ($(this).val() !== "") {
                            return vals.push($(this).val());
                        }
                    }
                });
                if (numInputsToProcess !== 0) {
                    pvtVals = _this.find(".pvtVals");
                    for (x = _m = 0; 0 <= numInputsToProcess ? _m < numInputsToProcess : _m > numInputsToProcess; x = 0 <= numInputsToProcess ? ++_m : --_m) {
                        newDropdown = $("<select class='pvtAttrDropdown invi tooff'>").append($("<option>")).on("change", function() {
                            return refresh();
                        });

                        for (_n = 0, _len4 = shownAttributes.length; _n < _len4; _n++) {
                            attr = shownAttributes[_n];
                            newDropdown.append($("<option>").val(attr).html(attr));
                        }
                        pvtVals.append(newDropdown);
                    }
                }
                if (initialRender) {
                    vals = opts.vals;
                    i = 0;
                    _this.find(".pvtVals select.pvtAttrDropdown").each(function() {
                        $(this).val(vals[i]);
                        return i++;
                    });
                    initialRender = false;
                }
                subopts.aggregatorName = aggregator.val();
                subopts.vals = vals;
                subopts.aggregator = opts.aggregators[aggregator.val()](vals);
                subopts.renderer = opts.renderers[renderer.val()];
                exclusions = {};
                _this.find('input.pvtFilter').not(':checked').each(function() {
                    var filter;
                    filter = $(this).data("filter");
                    if (exclusions[filter[0]] != null) {
                        return exclusions[filter[0]].push(filter[1]);
                    }
                    else {
                        return exclusions[filter[0]] = [filter[1]];
                    }
                });
                subopts.filter = function(record) {
                    var excludedItems, _ref6;
                    if (!opts.filter(record)) {
                        return false;
                    }
                    for (k in exclusions) {
                        excludedItems = exclusions[k];
                        if (_ref6 = "" + record[k], __indexOf.call(excludedItems, _ref6) >= 0) {
                            return false;
                        }
                    }
                    return true;
                };


                pivotTable.pivot(input, subopts)

                pivotUIOptions = $.extend(opts, {
                    cols: subopts.cols,
                    rows: subopts.rows,
                    vals: vals,
                    exclusions: exclusions,
                    aggregatorName: aggregator.val(),
                    rendererName: renderer.val()
                });
                _this.data("pivotUIOptions", pivotUIOptions);
                if (opts.autoSortUnusedAttrs) {
                    natSort = $.pivotUtilities.naturalSort;
                    unusedAttrsContainer = _this.find("td.pvtUnused.pvtAxisContainer");
                    $(unusedAttrsContainer).children("li").sort(function(a, b) {
                        return natSort($(a).text(), $(b).text());
                    }).appendTo(unusedAttrsContainer);
                }
                pivotTable.css("opacity", 1);
                if (opts.onRefresh != null) {
                    return opts.onRefresh(pivotUIOptions);
                }
            };
        })(this);
        refresh = (function(_this) {
            return function() {
                pivotTable.css("opacity", 0.5);
                return setTimeout(refreshDelayed, 10);
            };
        })(this);
        refresh();
		
		
		
        this.find(".pvtAxisContainer").sortable({
            update: function(e, ui) {
                if (ui.sender == null) {
                    return refresh();
                }
            },
            connectWith: this.find(".pvtAxisContainer"),
            items: 'li', placeholder: 'pvtPlaceholder', 
			receive:function(e){ 
			
			var my_id=e.originalEvent.originalEvent.path[1].id.split("_")[2];
			var rootTemp=e.originalEvent.originalEvent.path[1].id.split("_")[0]+"_"+e.originalEvent.originalEvent.path[1].id.split("_")[1]
	  if(e.target.id!=InternalID+"_unused")
	  {
	
	  for(k in inputOpts.linkedAttributes)
	  {
	  if(inputOpts.linkedAttributes[k].indexOf(my_id)!=-1){
	   for(kk in inputOpts.linkedAttributes[k]){
		internalTest=$("[id='"+rootTemp+"_"+inputOpts.linkedAttributes[k][kk]+"']");

           if(  internalTest.parent().get(0).id!=InternalID+"_unused"){
		   $("#"+e.target.id).append($(internalTest));}
		
	   }
	  break;
	  }
	  }
	  }
	  
	 else{$("#"+e.target.id).append($("#axis_"+my_id));}
			
			}
        });
		
		
		
		
		
        return this;

    };

    /*
     Heatmap post-processing
     */

    $.fn.barchart = function(monThis) {
        var barcharter, i, numCols, numRows, _i;
        /*numRows = this.data("numrows");
        numCols = this.data("numcols");
        */
		numRows = $(monThis).data("numrows");
        numCols = $(monThis).data("numcols");
		barcharter = (function(_this) {
            return function(scope) {
                var forEachCell, max, scaler, values;
                forEachCell = function(f) {
                    return _this.find(scope).each(function() {
                        var x;
								

                        x = (""+$(this).data("value")).split(',')[0];
                        if ((x != null) && isFinite(x)) {
                            return f(x, $(this));
                        }
                    });
                };
                values = [];
                forEachCell(function(x) {
                    return values.push(x);
                });
                max = Math.max.apply(Math, values);
                scaler = function(x) {
                    return 100 * x / (1.4 * max);
                };
                return forEachCell(function(x, elem) {
                    var text, wrapper;
                    text = elem.text();
                    wrapper = $("<div>").css({"position": "relative", "height": "55px"});
                    wrapper.append($("<div>").css({
                        "position": "absolute",
                        "bottom": 0,
                        "left": 0,
                        "right": 0,
                        "height": scaler(x) + "%",
                        "background-color": "gray"
                    }));
                    wrapper.append($("<div>").text(text).css({
                        "position": "relative",
                        "padding-left": "5px",
                        "padding-right": "5px"
                    }));
                    return elem.css({
                        "padding": 0,
                        "padding-top": "5px",
                        "text-align": "center"
                    }).html(wrapper);
                });
            };
        })($(monThis));
        for (i = _i = 0; 0 <= numRows ? _i < numRows : _i > numRows; i = 0 <= numRows ? ++_i : --_i)
        {barcharter(".pvtVal.row" + i);}
        barcharter(".pvtTotal.colTotal");
        //return this;
    return $(monThis);
    
	};

    $.fn.heatmap = function(monThis,scope) {
        var colorGen, heatmapper, i, j, numCols, numRows, _i, _j;
        if (scope == null) {
            scope = "heatmap";
        }
        numRows = $(monThis).data("numrows");
        numCols = $(monThis).data("numcols");
        colorGen = function(color, min, max) {
            var hexGen;
            hexGen = (function() {
                switch (color) {
                    case "red":
                        return function(hex) {
                            return "ff" + hex + hex;
                        };
                    case "green":
                        return function(hex) {
                            return "" + hex + "ff" + hex;
                        };
                    case "blue":
                        return function(hex) {
                            return "" + hex + hex + "ff";
                        };
                }
            })();
            return function(x) {
                var hex, intensity;
                intensity = 255 - Math.round(255 * (x - min) / (max - min));
                hex = intensity.toString(16).split(".")[0];
                if (hex.length === 1) {
                    hex = 0 + hex;
                }
                return hexGen(hex);
            };
        };
        heatmapper = (function(_this) {
            return function(scope, color) {
                var colorFor, forEachCell, values;
                forEachCell = function(f) {
                    return _this.find(scope).each(function() {
                        var x;
                        //x = $(this).data("value");
						 x = (""+$(this).data("value")).split(',')[0];
                        if ((x != null) && isFinite(x)) {
                            return f(x, $(this));
                        }
                    });
                };
                values = [];
                forEachCell(function(x) {
                    return values.push(x);
                });
                colorFor = colorGen(color, Math.min.apply(Math, values), Math.max.apply(Math, values));
                return forEachCell(function(x, elem) {
                    return elem.css("background-color", "#" + colorFor(x));
                });
            };
        })($(monThis));
        switch (scope) {
            case "heatmap":
                heatmapper(".pvtVal", "red");
                break;
            case "rowheatmap":
                for (i = _i = 0; 0 <= numRows ? _i < numRows : _i > numRows; i = 0 <= numRows ? ++_i : --_i) {
                    heatmapper(".pvtVal.row" + i, "red");
                }
                break;
            case "colheatmap":
                for (j = _j = 0; 0 <= numCols ? _j < numCols : _j > numCols; j = 0 <= numCols ? ++_j : --_j) {
                    heatmapper(".pvtVal.col" + j, "red");
                }
        }
        heatmapper(".pvtTotal.rowTotal", "red");
        heatmapper(".pvtTotal.colTotal", "red");
        return $(monThis);
    };
    /*
     Barchart post-processing
     */

    function addCommas(nStr) {
        var rgx, x, x1, x2;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? FAOSTATNEWOLAP.decimalSeparator + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + FAOSTATNEWOLAP.thousandSeparator + '$2');
        }
        if (FAOSTATNEWOLAP.thousandSeparator === " ") {
            x1 = x1.replace(/\s/g, "");
        }
        return x1 + x2;
    }



    return function() {
        return{
            render: render,
            destroy: destroy,
            changechkTreeview: changechkTreeview,
            exportExcel: exportExcel,
            exportCSV: exportCSV,
			showCode:showCode,
			showUnit:showUnit,
			showFlags:showFlags,
            originalData: originalData,
            myinputOpts: myinputOpts
        }
    };

});


/**Others Functions*/



