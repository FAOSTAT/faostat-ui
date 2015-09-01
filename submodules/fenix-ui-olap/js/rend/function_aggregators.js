define(function() {



    return {
        count: function(formatter) {
            if (formatter == null) {
                formatter = usFmtInt;
            }
            return function() {
                return function(data, rowKey, colKey) {
                    return {
                        count: 0,
                        push: function() {
                            return this.count++;
                        },
                        value: function() {
                            return this.count;
                        },
                        format: formatter
                    };
                };
            };
        },
        countUnique: function(formatter) {
            if (formatter == null) {
                formatter = usFmtInt;
            }
            return function(_arg) {
                var attr;
                attr = _arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        uniq: [],
                        push: function(record) {
                            var _ref;
                            if (_ref = record[attr], __indexOf.call(this.uniq, _ref) < 0) {
                                return this.uniq.push(record[attr]);
                            }
                        },
                        value: function() {
                            return this.uniq.length;
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        listUnique: function(sep) {
            return function(_arg) {
                var attr;
                attr = _arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        uniq: [],
                        push: function(record) {
                            var _ref;
                            if (_ref = record[attr], __indexOf.call(this.uniq, _ref) < 0) {
                                return this.uniq.push(record[attr]);
                            }
                        },
                        value: function() {
                            return this.uniq.join(sep);
                        },
                        format: function(x) {
                            return x;
                        },
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        sum: function(formatter) {
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(_arg) {
                var attr;
                attr = _arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        sum: null,
                        push: function(record) {
                            if (!isNaN(parseFloat(record[attr]))) {
                                return this.sum += parseFloat(record[attr]);
                            }
                        },
                        value: function() {
                            return this.sum;
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        sum2: function(formatter) {
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(_arg) {
                var attr;
                attr = _arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        sum: [null, "_", "_"],
                        push: function(record) {
                            if (!isNaN(parseFloat(record[attr]))) {
                                this.sum[0] += parseFloat(record[attr]);
                                if (this.sum[2] == "_") {
                                    this.sum[2] = record["Flag"];
                                    /*FAOSTATNEWOLAP.flags[record["Flag"]]=1;*/
                                }
                                if (this.sum[1] == "_") {
                                    this.sum[1] = record["Unit"];
                                }
                                return this.sum;
                            }
                        },
                        value: function() {
                            return this.sum;
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        average: function(formatter) {
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(_arg) {
                var attr;
                attr = _arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        sum: 0, len: 0,
                        push: function(record) {
                            if (!isNaN(parseFloat(record[attr]))) {
                                this.sum += parseFloat(record[attr]);
                                return this.len++;
                            }
                        },
                        value: function() {
                            return this.sum / this.len;
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        sumOverSum: function(formatter) {
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(_arg) {
                var denom, num;
                num = _arg[0], denom = _arg[1];
                return function(data, rowKey, colKey) {
                    return {
                        sumNum: 0,
                        sumDenom: 0,
                        push: function(record) {
                            if (!isNaN(parseFloat(record[num]))) {
                                this.sumNum += parseFloat(record[num]);
                            }
                            if (!isNaN(parseFloat(record[denom]))) {
                                return this.sumDenom += parseFloat(record[denom]);
                            }
                        },
                        value: function() {
                            return this.sumNum / this.sumDenom;
                        },
                        format: formatter,
                        numInputs: (num != null) && (denom != null) ? 0 : 2
                    };
                };
            };
        },
        sumOverSumBound80: function(upper, formatter) {
            if (upper == null) {
                upper = true;
            }
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(_arg) {
                var denom, num;
                num = _arg[0], denom = _arg[1];
                return function(data, rowKey, colKey) {
                    return {
                        sumNum: 0, sumDenom: 0,
                        push: function(record) {
                            if (!isNaN(parseFloat(record[num]))) {
                                this.sumNum += parseFloat(record[num]);
                            }
                            if (!isNaN(parseFloat(record[denom]))) {
                                return this.sumDenom += parseFloat(record[denom]);
                            }
                        },
                        value: function() {
                            var sign;
                            sign = upper ? 1 : -1;
                            return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                        },
                        format: formatter,
                        numInputs: (num != null) && (denom != null) ? 0 : 2
                    };
                };
            };
        },
        fractionOf: function(wrapped, type, formatter) {
            if (type == null) {
                type = "total";
            }
            if (formatter == null) {
                formatter = usFmtPct;
            }
            return function() {
                var x;
                x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return function(data, rowKey, colKey) {
                    return {
                        selector: {
                            total: [[], []],
                            row: [rowKey, []],
                            col: [[], colKey]
                        }[type],
                        inner: wrapped.apply(null, x)(data, rowKey, colKey),
                        push: function(record) {
                            return this.inner.push(record);
                        },
                        format: formatter,
                        value: function() {
                            return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                        },
                        numInputs: wrapped.apply(null, x)().numInputs
                    };
                };
            };
        }
    };

    /*
     return
     (function(tpl) {
     return {
     //"Sum": tpl.sum2(arrayFormat),
     // "Sum": tpl.sum(usFmtInt),
     "SumUnit": tpl.sum2(arrayFormat),
     "Sum": tpl.sum(usFmtInt),
     //"Count": tpl.count(usFmtInt),
     // "Integer Sum": tpl.sum(usFmtInt),
     "Average": tpl.average(usFmt)
     };
     })(aggregatorTemplates);*/
});