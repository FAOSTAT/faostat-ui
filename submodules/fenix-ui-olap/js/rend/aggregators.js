
define(['jquery','pivotAggregatorsFuncs'], function($, tpl) {


    addSeparators = function(nStr, thousandsSep, decimalSep) {
        var rgx, x, x1, x2;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? decimalSep + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
        }
        return x1 + x2;
    };


    arrayFormat = function(opts) {
        sigfig = 3;
        scaler = 1;
        return function(x) {
            var result;
            if (isNaN(x) || !isFinite(x)) {
                return "";
            }
            if (x === 0 && !opts.showZero) {
                return "";
            }
            result = addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
            return "" + opts.prefix + result + opts.suffix;
        };
    };

    numberFormat = function(opts) {
        var defaults;
        defaults = {
            digitsAfterDecimal: 2,
            scaler: 1,
            thousandsSep: ",",
            decimalSep: ".",
            prefix: "",
            suffix: "",
            showZero: false
        };

        opts = $.extend(defaults, opts);
        return function(x) {
            var result;
            if (isNaN(x) || !isFinite(x)) {
                return "";
            }
            if (x === 0 && !opts.showZero) {
                return "";
            }
            result = addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
            return "" + opts.prefix + result + opts.suffix;
        };
    };

    usFmt = numberFormat();
    arrFmt = arrayFormat();
    usFmtInt = numberFormat({digitsAfterDecimal: 0});
    usFmtPct = numberFormat({digitsAfterDecimal: 1, scaler: 100, suffix: "%"});




    return {"Sum2": tpl.sum2(arrayFormat),
        "Sum": tpl.sum(),
        "Count": tpl.count(usFmtInt),
        "Count Unique Values": tpl.countUnique(usFmtInt),
        "List Unique Values": tpl.listUnique(", "),
        "Integer Sum": tpl.sum(usFmtInt),
        "Average": tpl.average(usFmt),
       /* "Sum over Sum": tpl.sumOverSum(usFmt),
        "80% Upper Bound": tpl.sumOverSumBound80(true, usFmt),
        "80% Lower Bound": tpl.sumOverSumBound80(false, usFmt),
        "Sum as Fraction of Total": tpl.fractionOf(tpl.sum(), "total", usFmtPct),
        "Sum as Fraction of Rows": tpl.fractionOf(tpl.sum(), "row", usFmtPct),
        "Sum as Fraction of Columns": tpl.fractionOf(tpl.sum(), "col", usFmtPct),
        "Count as Fraction of Total": tpl.fractionOf(tpl.count(), "total", usFmtPct),
        "Count as Fraction of Rows": tpl.fractionOf(tpl.count(), "row", usFmtPct),
        "Count as Fraction of Columns": tpl.fractionOf(tpl.count(), "col", usFmtPct)*/
    }
});