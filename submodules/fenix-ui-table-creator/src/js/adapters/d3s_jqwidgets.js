/*global define, amplify, console*/
define([
        'jquery',
        'fx-t-c/config/adapters/d3s_jqwidgets',
        'underscore',
        'fx-t-c/adapters/d3sCodelistAdapter',
        'jqwidgets',
        'moment',
        'amplify',
        'jqxgrid.pager',
        'jqxgrid.filter',
        'jqxgrid.grouping',
        'jqxmenu'
    ],
    function ($, baseConfig, _, adapterCodelist) {

        'use strict';

        var defaultOptions = {

            lang: 'EN',

            s: {
                CONTENT: '[data-role="content"]'
            },

            dataSource: {
                source: {},
                columns: []
            },

            codeVisualization: "#code|[ $code ] - ~#label|$label ~|",

            translation: {},

            codelist: {},

            aux: {
                ids: [],
                subjects: [],
                id2index: {},
                index2id: {},
                code2label: {},
                subject2id: {},
                id2subject: {},
                nameIndexes: [],
                id2Datatypes: {},
                index2Datatypes: {}
            }
        }, e = {
            DESTROY: 'fx.component.table.destroy',
            READY: 'fx.component.table.ready'
        };

        function D3S_JQWidgets_Adapter() {
            $.extend(true, this, defaultOptions);
        };


        D3S_JQWidgets_Adapter.prototype.render = function (config) {
            $.extend(true, this, config);
            this.$originalConfig = config;

            if (this._validateInput() === true) {
                this._initVariables();
                /* this.TEST_removeLabel(0);
                 this.TEST_removeLabel(2);*/

                this._prepareDSDData();
                if (this.checkIfNotWaitingForCodelists()) {
                    console.log('without codelist')
                    if (this._validateData() === true) {
                        this._onValidateDataSuccess(config);
                    } else {
                        this._onValidateDataError();
                    }
                }
            } else {
                console.error(this.errors);
                throw new Error("FENIX Table creator has not a valid configuration");
            }
        };


        D3S_JQWidgets_Adapter.prototype.checkIfNotWaitingForCodelists = function () {

            if ($.isEmptyObject(this.$waitForCodelist) === false) {
                for (var codeColumn in this.$waitForCodelist) {
                    if (this.$waitForCodelist[codeColumn] === true)
                        return false;
                }
            }
            return true;

        };


        D3S_JQWidgets_Adapter.prototype._onValidateDataWithCodelist = function () {
            var self = this;
            if (this._validateData() === true) {
                this._onValidateDataSuccess(self.$originalConfig);
            } else {
                this._onValidateDataError();
            }
        };


        D3S_JQWidgets_Adapter.prototype._prepareDSDData = function () {

            this.$columns.forEach(_.bind(function (column, index) {

                if (column.hasOwnProperty('id')) {

                    if (this._isARightIDColumn(column.id, index)) {

                        if (column.hasOwnProperty('subject')) {
                            this.aux.subject2id[column.subject] = column.id;
                            this.aux.id2subject[column.id] = column.subject;
                            this.aux.subjects.push(column.subject);
                        }

                        if (column.subject === 'value') {
                            this.aux.$columnValueIndex = index;
                        }

                        if (column.hasOwnProperty('dataType')) {
                            this.aux.index2Datatypes[index] = column.dataType;
                            this.aux.id2Datatypes[column.id] = column.datatype;
                        } else {
                            throw new Error("DSD is not correct: it doesn't have datatype on column: " + index);
                        }

                        this.$titles.push(column.title[defaultOptions.lang]);
                    }
                }
                else {
                    throw new Error("DSD is not correct: it doesn't have id on column: " + index);
                }
            }, this));
            this._prepareDataForVisualization();
            if (this.checkIfNotWaitingForCodelists()) {
                this._prepareVisualizationData();
            }
        };


        D3S_JQWidgets_Adapter.prototype._prepareDataForVisualization = function () {
            var rowIndexes = Object.keys(this.aux.index2Datatypes);
            var datatypeTmp;
            for (var i = 0; i < this.$originalData.length; i++) {
                // fill each row
                var row = {};
                var trueIndex = null;
                for (var j = 0, length = rowIndexes.length; j < length; j++) {

                    trueIndex = rowIndexes[j]; //there could be different false virtual columns in different positions
                    datatypeTmp = this.aux.index2Datatypes[trueIndex];

                    if (this._isADatatypeCodeColumn(datatypeTmp)) {
                        this._createCode2LabelMap(this.$originalData[i], trueIndex);
                    }
                }
            }
        };


        D3S_JQWidgets_Adapter.prototype.TEST_removeLabel = function (indexColumn) {

            var codes = this.$columns[indexColumn].values.codes[0].codes;
            for (var i = 0; i < codes.length; i++) {
                var newCode = {}
                newCode.code = codes[i].code;
                codes[i] = newCode;
            }
        };


        D3S_JQWidgets_Adapter.prototype._isARightIDColumn = function (idColumn, indexColumn) {

            var isArightColumn;

            if (!(this._isAVirtualColumn(idColumn, indexColumn))) {
                isArightColumn = true;
                this.aux.id2index[idColumn] = indexColumn;
                this.aux.index2id[indexColumn] = idColumn;
                this.aux.ids.push(idColumn);
            } else {
                isArightColumn = false;
            }
            return isArightColumn;
        };


        D3S_JQWidgets_Adapter.prototype._isAVirtualColumn = function (idLabel, indexLabel) {

            var result;

            if (idLabel && idLabel != null && idLabel.length > 3) {
                var idOriginalColumn = idLabel.substring(0, idLabel.length - 3);
                if (this.aux.id2index[idOriginalColumn]) {
                    result = true;
                    this._setVariablesForVirtualColumn(idOriginalColumn, indexLabel);
                } else {
                    result = false;
                }
            } else {
                result = false;
            }
            return result;
        };


        D3S_JQWidgets_Adapter.prototype._setVariablesForVirtualColumn = function (idOriginalColumn, indexVirtualColumn) {

            if (!this.aux.indexCodeColumn2indexVirtualColumn) {
                this.aux.indexCodeColumn2indexVirtualColumn = {};
            }
            this.aux.indexCodeColumn2indexVirtualColumn[this.aux.id2index[idOriginalColumn]] = indexVirtualColumn;
        };


        D3S_JQWidgets_Adapter.prototype._prepareVisualizationData = function () {

            var self = this;
            var rowIndexes = Object.keys(this.aux.index2Datatypes);
            var datatypeTmp;
            for (var i = 0; i < this.$originalData.length; i++) {
                // fill each row
                var row = {};
                var trueIndex = null;
                for (var j = 0, length = rowIndexes.length; j < length; j++) {

                    trueIndex = rowIndexes[j]; //there could be different false virtual columns in different positions
                    datatypeTmp = this.aux.index2Datatypes[trueIndex];

                    if (this._isADatatypeCodeColumn(datatypeTmp)) {
                        row[self.aux.ids[j]] = self._getVisualizationLabel(self.$originalData[i][trueIndex], trueIndex);
                    } else {
                        row[this.aux.ids[j]] =
                            (this.$originalData[i][trueIndex]) ? this.$originalData[i][trueIndex] : null;
                    }
                    this._handleColumnsForJQwidgets(i, j);
                }
                this.$visualizationData[i] = row;
            }
            this._setDataForJQXGrid();
        };


        D3S_JQWidgets_Adapter.prototype._getVisualizationLabel = function (code, trueIndex) {
            return this._convertLabelCodeInDefinedFormat(code, this.aux.code2label[trueIndex][code], this.codeVisualization);
        };


        D3S_JQWidgets_Adapter.prototype._convertLabelCodeInDefinedFormat = function (code, label, expression) {
            var conditionRegExpression = /(#(\w+)(\|))/;
            var valuesRegExpression = /(((\W)|(\s))*(\$\w+)((\W)|(\s))*(\~))/;
            var onlyValue = /(\$\w+)/;
            var result = "";

            while (expression != "" && expression != "|") {
                var matchedExp = expression.match(conditionRegExpression);
                if (matchedExp !== null) {
                    var firstCondition = matchedExp[0]
                    expression = expression.replace(conditionRegExpression, "")
                    firstCondition = firstCondition.slice(0, -1);
                    if (firstCondition.substring(1) == "label") {
                        if (label && label != null) {
                            var secondCondition = expression.match(valuesRegExpression)[0];
                            expression = expression.replace(valuesRegExpression, "")
                            secondCondition = secondCondition.slice(0, -1);
                            var stringAppend = secondCondition.replace(onlyValue, function (match) {
                                var returnedValue;
                                returnedValue = (match.substring(1) == "label") ? label : null;
                                return returnedValue;
                            })
                            result += stringAppend;
                        } else {
                            break;
                        }
                    }
                    else {
                        if (firstCondition.substring(1) == "code") {
                            if (code && code != null) {
                                var secondCondition = expression.match(valuesRegExpression)[0];
                                expression = expression.replace(valuesRegExpression, "")
                                secondCondition = secondCondition.slice(0, -1);
                                var stringAppend = secondCondition.replace(onlyValue, function (match) {
                                    var returnedValue;
                                    returnedValue = (match.substring(1) == "code") ? code : null;
                                    return returnedValue;
                                })
                                result += stringAppend;
                            }
                        }
                    }
                }
            }
            return result;
        };


        D3S_JQWidgets_Adapter.prototype._createCode2LabelMap = function (rowData, indexColumn) {


            var self = this;

            if (this._checkIfNotExistsCodeInMap(indexColumn, rowData)) {
                /*
                 if (this.$codelist == null) {
                 */
                if (this._areLabelsIntoVirtualColumn()) {

                    this.aux.code2label[indexColumn][rowData[indexColumn]] = rowData[this.aux.indexCodeColumn2indexVirtualColumn[indexColumn]];
                }
                else if (this._areLabelsIntoDistinct(indexColumn)) {
                    this.aux.code2label[indexColumn][rowData[indexColumn]] =
                        this._getLabelFromDistinctOrDomain(this.$columns[indexColumn].values.codes[0].codes, rowData[indexColumn]);


                } else if (this._existCodelistIntoDomain(indexColumn)) {
                    this._handleDomainCodeCase(rowData, indexColumn);

                } else {
                    this.aux.code2label[indexColumn][rowData[indexColumn]] = rowData[indexColumn];
                }
            }
        };


        D3S_JQWidgets_Adapter.prototype._handleDomainCodeCase = function (rowData, indexColumn) {
            if (this._areLabelsIntoDomain(indexColumn)) {

                if (!this.aux.code2label[indexColumn][rowData[indexColumn]]) {
                    this.aux.code2label[indexColumn][rowData[indexColumn]] =
                        this._getLabelFromDistinctOrDomain(this.$columns[indexColumn].domain.codes[0].codes, rowData[indexColumn]);
                }

            } else { // look for the codelist if there is one
                this.$codelist = this.$columns[indexColumn].domain.codes[0].idCodeList;
                this.$codelistVersion = (this.$columns[indexColumn].domain.codes[0].version) ? this.$columns[indexColumn].domain.codes[0].version : null;

                if (!this.$waitForCodelist[indexColumn]) {
                    this.$waitForCodelist[indexColumn] = true;
                    this._useCodelistToCreateMap(indexColumn);
                }
            }
        };


        D3S_JQWidgets_Adapter.prototype._checkIfNotExistsCodeInMap = function (indexColumn, rowData) {

            var result = false;
            if (this.aux.code2label[indexColumn] && this.aux.code2label[indexColumn][rowData[indexColumn]]) {
            } else {
                if (!this.aux.code2label[indexColumn]) {
                    this.aux.code2label[indexColumn] = {};
                }
                result = true;
            }
            return result;
        };


        D3S_JQWidgets_Adapter.prototype._createDistinctCodesFromData = function (indexColumn) {

            var distinctCodes = {};
            for (var i = 0, length = this.$originalData.length; i < length; i++) {
                distinctCodes[this.$originalData[i][indexColumn]] = true;
            }
            return Object.keys(distinctCodes);
        };


        D3S_JQWidgets_Adapter.prototype._createMap = function (dataCodelist, indexColumn) {
            var self = this;
            for (var i = 0, length = dataCodelist.length; i < length; i++)
                self.aux.code2label[indexColumn][dataCodelist[i].code] = dataCodelist[i].title[self.lang]
        };


        D3S_JQWidgets_Adapter.prototype._useCodelistToCreateMap = function (indexColumn) {

            var self = this;
            var distinctCodes = self._createDistinctCodesFromData(indexColumn);
            console.log(distinctCodes);
            if (this._notExistsCodelistAdapterFromHost()) {
                var CodelistAdapter = new adapterCodelist;
                $.when(CodelistAdapter.render(
                    {
                        "uid": self.$codelist,
                        "version": self.$codelistVersion,
                        "lang": self.lang,
                        "codes": distinctCodes,
                        "callback": self._createMap
                    })).done(function (res) {
                    self.$waitForCodelist[indexColumn] = false;
                    self._createMap(res, indexColumn);

                    if (self.checkIfNotWaitingForCodelists()) {
                        self._prepareVisualizationData();
                        self._onValidateDataWithCodelist();
                    }
                });
            }
            else {
                // TODO binded to !this._notExistsCodelistAdapterFromHost()
            }
        };


        D3S_JQWidgets_Adapter.prototype._notExistsCodelistAdapterFromHost = function () {
            // TODO
            return true;
        };


        D3S_JQWidgets_Adapter.prototype._getLabelFromDistinctOrDomain = function (codes, codeToSearch) {
            for (var i = 0, length = codes.length; i < length; i++) {
                if (codes[i].code === codeToSearch) {
                    if (codes[i].label) {
                        return codes[i].label[this.lang];
                    } else {
                        return "";
                    }
                }
            }
        };


        D3S_JQWidgets_Adapter.prototype._existCodelistIntoDomain = function (indexCodeRow) {
            return this.$columns[indexCodeRow].domain.codes[0].idCodeList;
        };


        D3S_JQWidgets_Adapter.prototype._areLabelsIntoDomain = function (indexCodeRow) {
            return this.$columns[indexCodeRow].domain.codes[0].codes
                && this.$columns[indexCodeRow].domain.codes[0].codes[0].label;
        };


        D3S_JQWidgets_Adapter.prototype._areLabelsIntoVirtualColumn = function () {
            return this.aux.indexCodeColumn2indexVirtualColumn;
        };


        D3S_JQWidgets_Adapter.prototype._areLabelsIntoDistinct = function (indexCodeRow) {
            return this.$columns[indexCodeRow].values.codes[0].codes[0].label;
        };


        D3S_JQWidgets_Adapter.prototype._isADatatypeCodeColumn = function (datatype) {
            return (datatype === 'code' || datatype === 'customCode')
        };


        D3S_JQWidgets_Adapter.prototype._setDataForJQXGrid = function () {
            this.dataSource.source = new $.jqx.dataAdapter({localdata: this.$visualizationData, datatype: "array"});
        };


        D3S_JQWidgets_Adapter.prototype._handleColumnsForJQwidgets = function (indexRow, indexColumn) {
            if (indexRow === 0) {
                var column = {};
                column.text = this.$titles[indexColumn];
                column.datafield = this.aux.ids[indexColumn]
                this.dataSource.columns.push(column);
            }
        };


        D3S_JQWidgets_Adapter.prototype._isADatatypeWithoutConversion = function (datatype) {
            return (datatype === 'number'
            || datatype === 'text' || datatype === 'boolean'
            || datatype === 'percentage' || datatype === 'enumeration')
        };


        D3S_JQWidgets_Adapter.prototype._validateData = function () {
            this.errors = {};
            return (Object.keys(this.errors).length === 0);
        };


        D3S_JQWidgets_Adapter.prototype._onValidateDataSuccess = function (config) {
            this.$gridRendered = true;
            this._createConfiguration(config);
            this._renderTable();
        };


        D3S_JQWidgets_Adapter.prototype._showConfigurationForm = function () {
            window.alert("FORM");
        };


        D3S_JQWidgets_Adapter.prototype._onValidateDataError = function () {
            this._showConfigurationForm();
        };


        D3S_JQWidgets_Adapter.prototype._createConfiguration = function (config) {

            this.config = (config.options) ? $.extend(true, config.options, this.dataSource) : $.extend(true, this.dataSource, baseConfig);
            this.config.ready = function () {
                amplify.publish(e.READY, this);
            };
        };


        D3S_JQWidgets_Adapter.prototype._renderTable = function () {

            var self = this;

            this.$container.jqxGrid(this.config);
        };


        D3S_JQWidgets_Adapter.prototype._initVariables = function () {

            this.$container = $(this.container).find(this.s.CONTENT);
            this.$waitForCodelist = {};
            this.$metadata = this.model.metadata;
            this.$dsd = this.$metadata.dsd;
            this.$columns = this.$dsd.columns;
            this.$titles = [];
            this.$originalData = this.model.data || [];
            this.$visualizationData = [];
            this.$codelist = ($.isEmptyObject(this.codelist)) ? null : this.codelist;
        };


        D3S_JQWidgets_Adapter.prototype._validateInput = function () {

            this.errors = {};

            //Container
            if (!this.hasOwnProperty("container")) {
                this.errors.container = "'container' attribute not present.";
            }

            if ($(this.container).find(this.s.CONTENT) === 0) {
                this.errors.containe = "'container' is not a valid HTML element.";
            }

            //Model
            if (!this.hasOwnProperty("model")) {
                this.errors.model = "'model' attribute not present.";
            }

            if (typeof this.model !== 'object') {
                this.errors.model = "'model' is not an object.";
            }

            //Metadata
            if (!this.model.hasOwnProperty("metadata")) {
                this.errors.metadata = "Model does not container 'metadata' attribute.";
            }

            //DSD
            if (!this.model.metadata.hasOwnProperty("dsd")) {
                this.errors.dsd = "Metadata does not container 'dsd' attribute.";
            }

            //Columns
            if (!Array.isArray(this.model.metadata.dsd.columns)) {
                this.errors.columns = "DSD does not container a valid 'columns' attribute.";
            }

            //Option
            if (this.options && typeof this.options !== 'object') {
                this.error.options = "'options' is not an object.";
            }

            //Data
            if (!this.model.hasOwnProperty("data")) {
                this.errors.data = "Model does not contain 'data' attribute.";
            }

            return (Object.keys(this.errors).length === 0);
        };


        D3S_JQWidgets_Adapter.prototype._getColumnBySubject = function (subject) {

            var id = this.aux.subject2id[subject],
                index;

            if (!id) {
                return;
            }

            index = this.aux.id2index[id];

            if (!index) {
                return;
            }

            return this.$columns.length > index ? this.$columns[index] : null;
        };


        D3S_JQWidgets_Adapter.prototype._getColumnIndexBySubject = function (subject) {

            _.each(this.$columns, function (column, i) {
                if (column.subject === subject) {
                    return i;
                }
            }, this);

            return -1;
        };


        D3S_JQWidgets_Adapter.prototype.destroy = function () {

            amplify.publish(e.DESTROY);
            this.$container.jqxGrid('destroy', this);
        };


        D3S_JQWidgets_Adapter.prototype.applyEvent = function (event) {

            if (typeof this.$container !== 'undefined' && this.$gridRendered) {
                this.$container.jqxGrid(event);
                return true;
            }
            console.error('it is not possible to apply the event: ' + event);
        };


        return D3S_JQWidgets_Adapter;
    });