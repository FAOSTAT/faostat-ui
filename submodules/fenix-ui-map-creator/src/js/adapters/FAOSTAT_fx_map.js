/*global define, amplify, FM */
define([
        'jquery',
        'fx-m-c/config/adapters/FAOSTAT_fx_map',
        'underscore',
        'fenix-ui-map',
        'amplify'
    ],
    function ($, baseConfig, _) {

        'use strict';

        var defaultOptions = {
                lang: 'EN',
                s: {
                    CONTENT: '[data-role="content"]'
                }
            },
            e = {
                DESTROY: 'fx.component.map.destroy',
                READY: 'fx.component.map.ready'
            };

        function FENIX_FX_MAP_Adapter() {
            this.o = $.extend(true, {}, defaultOptions);
        }

        FENIX_FX_MAP_Adapter.prototype.render = function (config) {
            this.o = $.extend(true, {}, this.o, config);

            if (this._validateInput() === true) {
                this._initVariable();
                this._prepareData();
                if (this._validateData() === true) {
                    this._onValidateDataSuccess();
                } else {
                    this._onValidateDataError();
                }
            } else {
                throw new Error("FENIX Map creator has not a valid configuration");
            }
        };

        FENIX_FX_MAP_Adapter.prototype._prepareData = function () {

        };

        FENIX_FX_MAP_Adapter.prototype._validateData = function () {
            this.errors = {};
            return (Object.keys(this.errors).length === 0);
        };

        FENIX_FX_MAP_Adapter.prototype._initVariable = function () {
            //this.$container = $(this.container).find(this.s.id);
            //this.$metadata = this.model.metadata;
            //this.$dsd = this.$metadata.dsd;
            //this.$columns = this.$dsd.columns;
            //this.$data = this.model.data;
            this.$map = $(this.o.container).find(this.o.s.CONTENT);
        };

        FENIX_FX_MAP_Adapter.prototype._validateInput = function () {
            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        FENIX_FX_MAP_Adapter.prototype._onValidateDataSuccess = function () {
            this.$mapRendered = true;
            this._createConfiguration();
            this._renderMap();
        };

        FENIX_FX_MAP_Adapter.prototype._createConfiguration = function () {
            this.o = $.extend(true, {}, baseConfig, this.o);
        };

        FENIX_FX_MAP_Adapter.prototype._renderMap = function () {
            this.fenixMap = new FM.Map(this.$map, this.o.fenix_ui_map, this.o.leaflet);
            this.fenixMap.createMap();
            // Map Ready event
            amplify.publish(e.READY, this);
        };

        FENIX_FX_MAP_Adapter.prototype.addLayer = function (model, layerOptions, modelOptions) {

            var modelType = ((modelOptions === null || modelOptions === undefined)? 'fenix': (modelOptions.modelType) || 'fenix');

            var layer = null;
            // TODO: switch to check if it's a fenix layer
            if (!model.hasOwnProperty("metadata")) {
                this.errors.metadata = "Model does not contain 'metadata' attribute.";
                throw new Error("FENIX Map creator has not a valid configuration");
            }

            // Handle layers from FENIX (D3S)
            if (!model.hasOwnProperty("data")) {
                // standard layer
                layer = this.createLayerFenix(model);
            }
            else {
                if (modelType === 'fenix') {
                    // Create Join data layer
                    layer = this.createLayerFenixJoin(model);
                }
                else if (modelType === 'faostat') {
                    // Create Join data layer
                    layer = this.createLayerFaostatJoin(model, modelOptions);
                }
            }
            if (layerOptions !== null) {
                layer = $.extend(true, {}, layer, layerOptions);
            }

            layer = new FM.layer(layer);
            this.fenixMap.addLayer(layer);
            return layer;
        };

        FENIX_FX_MAP_Adapter.prototype.createLayerFenix = function (model) {
            var metadata = model.metadata;
            var layer = {};

            // Define the layer
            if (metadata.hasOwnProperty("dsd")) {
                layer.layers = "";
                if (metadata.dsd.hasOwnProperty("workspace")) {
                    layer.layers += metadata.dsd.workspace + ":";
                }
                layer.layers += metadata.dsd.layerName;
            }
            else {
                this.errors['dsd'] = "Model['metadata'] does not contain 'dsd' attribute.";
                throw new Error("FENIX Map creator has not a valid configuration");
            }

            // WMS Server
            if (model.hasOwnProperty("datasource")) {
                console.warn("TODO: IMPORTAT! check which datasource and the right url from D3S!");
                // TODO: IMPORTAT! check which datasource and the right url from D3S!
            }
            else {
                console.warn("'datasource' propery not found in model. Using the default wms server: " + this.config.url.wms);
                layer.urlWMS = this.config.url.wms;
            }

            // Options
            layer.layertitle =  metadata["title"][this.lang];
            layer.opacity = '0.9';
            return layer;
        };

        // JOIN
        FENIX_FX_MAP_Adapter.prototype.createLayerFenixJoin = function (model) {
            if (this._validateJoinInput(model) === true) {
                // create the join layer
                var layer = this.getJoinLayerFenix(model);
                $.extend(true, layer, this.o.join.style);

                // Layer title TODO: Add title if exist (check in the validator)
                if (model['metadata'].hasOwnProperty("title")) {
                    if (model['metadata']['title'][this.o.lang] !== null) {
                        layer.layertitle = model['metadata']['title'][this.o.lang];
                    }
                }
                else {
                    layer.layertitle = model['metadata']['uid'];
                }

                // create popup
                // TODO: Handle more dinamically from the model 'geo' codelist.
                layer.customgfi = {
                    content: {
                        EN: "<div class='fm-popup'>{{"+ layer.joincolumnlabel +"}}<div class='fm-popup-join-content'>{{{"+ layer.joincolumn + "}}} {{measurementunit}}</div></div>"
                    },
                    showpopup: true
                };

                // TODO: add check on the zoomto data (move it to a function)
                var codes = []
                layer.joindata.forEach(function (code) {
                    _.keys(code).forEach(function (key) {
                        codes.push(key);
                    });
                });
                var zoomlayer = layer.layers.split(":");
                zoomlayer = zoomlayer.length > 1? zoomlayer[1]: zoomlayer[0];
                this.fenixMap.zoomTo(zoomlayer, layer.joincolumn, codes);
                return layer;
            } else {
                console.error(this.errors);
                throw new Error("FENIX Map creator has not a valid JOIN configuration");
            }
        };

        FENIX_FX_MAP_Adapter.prototype.getJoinLayerFenix = function (model, modelOptions) {
            var metadata = model['metadata'];
            var columns = metadata['dsd']['columns'];
            var geoColumn = {};
            var valueColumn = {};
            var muColumn = {};
            columns.forEach(_.bind(function (column, index) {
                if (column.subject === this.o.geoSubject || column.id === this.o.geoSubject ) {
                    geoColumn = column;
                    geoColumn.index = index;
                }
                if (column.subject === this.o.valueSubject) {
                    valueColumn = column;
                    valueColumn.index = index;
                }
                if (column.subject === this.o.muSubject) {
                    muColumn = column;
                    muColumn.index = index;
                }
            }, this));


            if (this._validateJoinColumnInputFenix(geoColumn)) {
                // TODO: check reference area and if exist the variable geoColumn['domain']['codes'][0].idCodeList
                //var layer = this.join.layerMapping[geoColumn['domain']['codes'][0].idCodeList.toLowerCase()];
                var layer = null;
                var codelist = geoColumn['domain']['codes'][0].idCodeList.toLowerCase();

                // if codelist has a mapping with the join.layerMapping then use it.
                if (this.o.join.layerMapping[codelist]) {
                    layer = this.o.join.layerMapping[codelist];
                }

                // else check with the referenceArea the right correspondacy
                else {
                    geoColumn['domain']['codes'][0].idCodeList.toLowerCase();
                    // TODO: Handle reference Area
                    var referenceArea = metadata["meContent"]["seReferencePopulation"]["referenceArea"]['codes'][0].code.toLowerCase();
                    layer = this.o.join.layerMapping[codelist + "_" + referenceArea];
                }

                // data model to be mapped
                var data = model.data;


                // check measurementunit
                // TODO: Add measurement unit to the layer definition (using label column of the mu)
                //

                // get joinData
                layer.joindata = this.getJoinData(data, geoColumn.index, valueColumn.index);

                // TODO: check on the column index
                layer.measurementunit = data[0][muColumn.index];

                // TODO: check if is the right legendtitle
                layer.legendtitle = layer.measurementunit;

                return layer;
            } else{
                console.error('Error JoinColumnInput not valid')
            }
        };

        FENIX_FX_MAP_Adapter.prototype.createLayerFaostatJoin = function (model, modelOptions) {

            if (this._validateJoinInput(model) === true) {
                // create the join layer
                var layer = this.getJoinLayerFaostat(model, modelOptions);
                $.extend(true, layer, this.o.join.style);

                // Layer title TODO: Add title if exist (check in the validator)
                if (model['metadata'].hasOwnProperty("title")) {
                    if (model['metadata']['title'][this.o.lang] !== null) {
                        layer.layertitle = model['metadata']['title'][this.o.lang];
                    }
                }
                else {
                    layer.layertitle = model['metadata']['uid'];
                }

                // create popup
                // TODO: Handle more dinamically from the model 'geo' codelist.
                layer.customgfi = {
                    content: {
                        EN: "<div class='fm-popup'>{{"+ layer.joincolumnlabel +"}}<div class='fm-popup-join-content'>{{{"+ layer.joincolumn + "}}} {{measurementunit}}</div></div>"
                    },
                    showpopup: true
                };

                // TODO: add check on the zoomto data (move it to a function)
                var codes = [];
                layer.joindata.forEach(function (code) {
                    _.keys(code).forEach(function (key) {
                        codes.push(key);
                    });
                });
                var zoomlayer = layer.layers.split(":");
                zoomlayer = zoomlayer.length > 1? zoomlayer[1]: zoomlayer[0];
                this.fenixMap.zoomTo(zoomlayer, layer.joincolumn, codes);
                return layer;
            } else {
                console.error(this.errors);
                throw new Error("FENIX Map creator has not a valid JOIN configuration");
            }
        };

        FENIX_FX_MAP_Adapter.prototype.getJoinLayerFaostat = function (model, modelOptions) {
            var metadata = model['metadata'];
            var columns = metadata['dsd'];
            var dimensions = modelOptions['dimensions'];
            var geoColumn = {};
            var valueColumn = {};
            var muColumn = {};
            columns.forEach(_.bind(function (column) {
                if (column.dimension_id === dimensions.geoDimensions.dimension_id && column.type === dimensions.geoDimensions.type){
                    geoColumn = column;
                    geoColumn.index = column.index;
                    geoColumn.key = column.key;
                }
                if (column.dimension_id === dimensions.valueDimensions.dimension_id && column.type === dimensions.valueDimensions.type){
                    valueColumn = column;
                    valueColumn.index = column.index;
                    valueColumn.key = column.key;
                }
                if (column.dimension_id === dimensions.muDimensions.dimension_id && column.type === dimensions.muDimensions.type){
                    muColumn = column;
                    muColumn.index = column.index;
                    muColumn.key = column.key;
                }
            }, this));

            if (this._validateJoinColumnInputFaostat(geoColumn) || true) {

                var layerMapping = modelOptions.layerMapping || "faostat";

                var layer = this.o.join.layerMapping[layerMapping][modelOptions.lang || 'en'];

                // data model to be mapped
                var data = model.data;
                // get joinData
                layer.joindata = this.getJoinData(data, geoColumn.key, valueColumn.key);

                // TODO: check on the column index
                layer.measurementunit = data[0][muColumn.index];

                // TODO: check if is the right legendtitle
                layer.legendtitle = layer.measurementunit;

                // layerTitle?
                console.warn("layer title?");
                console.log(layer);
                return layer;
            } else{
                console.error('Error JoinColumnInput not valid')
            }
        };

        FENIX_FX_MAP_Adapter.prototype.getJoinData = function (data, geoColumnKey, valueColumnKey) {
            var joindata = [];

            // TODO: remove cachedValues on final version. Check on join data consistency?
            var cachedValues = {};
            console.log(data);
            // TODO: add on check
            data.forEach(_.bind(function (row) {
                var obj = {};
                var code = row[geoColumnKey];
                var value = row[valueColumnKey];
                if (code && value) {
                    obj[code] = value ;
                    if (!cachedValues.hasOwnProperty(code)) {
                        // check null values
                        cachedValues[code] = true;
                        joindata.push(obj);
                    }
                }
            }, this));

            return joindata;
        };

        // TODO: Add additional validations constraints
        // Costrains: on geoColumn
        // column['dataType'] == code
        // column['key'] == true
        // column['domain']['codes'][0].idCodelist == gaul0
        // look to referenceArea i.e. gaul0, gaul2, gaul2)
        FENIX_FX_MAP_Adapter.prototype._validateJoinInput = function (model) {
            this.errors = {};

            //Metadata TODO: add all metadata checks
            if (!model.hasOwnProperty("metadata")) {
                this.errors.metadata = "'metadata' attribute not present.";
            }

            //Data
            if (!model.hasOwnProperty("data")) {
                this.errors.data = "'data' attribute not present.";
            }

            return (Object.keys(this.errors).length === 0);
        };

        FENIX_FX_MAP_Adapter.prototype._validateJoinColumnInputFaostat = function (column) {
            return true;
        };

        FENIX_FX_MAP_Adapter.prototype._validateJoinColumnInputFenix = function (column) {
            this.errors = {};

            //Metadata TODO: add all metadata checks
            if (!column.hasOwnProperty('key')) {
                this.errors.column = "'key' attribute not present.";
            }
            else {
                if (column.key !== true) {
                    this.errors.column = "'key' is not true.";
                }
            }

            if (!column.hasOwnProperty('dataType')) {
                this.errors.column = "'dataType' attribute not present.";
            }
            else {
                if (column.dataType !== 'code') {
                    this.errors.column = "'dataType' attribute is not a coding system.";
                }
            }

            // TODO: check domain and referencearea if needed

            return (Object.keys(this.errors).length === 0);
        };

        FENIX_FX_MAP_Adapter.prototype.addCountryBoundaries = function (layer) {
            // if add boundaries by default
            if (layer !== null && layer !== undefined) {
                this.o.layers.boundary = $.extend(true, {}, layer, this.o.layers.boundary);
            }
            this.fenixMap.addLayer(new FM.layer(this.o.layers.boundary));
        };

        FENIX_FX_MAP_Adapter.prototype.removeLayer = function (layer) {
            this.fenixMap.removeLayer(layer);
        };

        FENIX_FX_MAP_Adapter.prototype.invalidateSize = function () {
            this.fenixMap.map.invalidateSize();
        };

        return FENIX_FX_MAP_Adapter;
    });