/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/indicators/Config',
    'text!templates/indicators/indicators.hbs',
    'i18n!nls/indicators',
    'fs-r-t/start',
    'fs-dt-c/table',
    'faostatapiclient',
    'q',
    'lib/filters/filter-box',
    'lib/filters/filter',
    'lib/dashboard-compose/dashboard-compose',
    'lib/release-calendar/release-calendar',
    'sigma',
    'sigma.plugins.dragNodes',
    'sigma.plugins.relativeSize',
    'sigma.plugins.animate',
    'sigma.plugins.neighborhoods',
    'sigma.layout.forceAtlas2',
    'amplify'
], function ($,
             log,
             Common,
             View,
             C,
             E,
             CM,
             template,
             i18nLabels,
             ReportTable,
             Table,
             API,
             Q,
             FilterBox,
             Filter,
             DashBoardComposer,
             ReleaseCalendar
 ) {

    'use strict';

    var s,
        IndicatorsView;

    s = {

    };

    // TODO: at the moment is used just for testing. The indicator view is not implemented yet.
    IndicatorsView = View.extend({

        autoRender: true,

        className: 'indicators',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);

        },

        test: function() {

            return Q.fcall(function () {
                return 10;
            });

        },

        getTemplateData: function () {
            return $.extend(this, {}, i18nLabels, {data: CM.data});
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {indicators: 'indicators'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

            log.info("----------------");
            var c = this.test();
            log.info(c);
            var d = c.then(function(v) {
               log.info("1 ", v);
               return 15;
            }).done(function(v) {
                log.info("2 ", v);
                return 25;
            });



        },

        initVariables: function () {

            // this.initTable();

            //this.initFiltersBox();

             this.initDashBoardComposer();

            // this.initReleaseCalendar();

            //this.testQueries();

            //this.initSigma();

        },

        initSigma: function() {

            var data = {
                nodes: [],
                edges: []
            },
            isAlternateSize = false;

            var nodesCache = {};

            amplify.publish(E.LOADING_SHOW, {container: '#sigma'});


            API.data({
                domain_code: ['TM'],
                reporterarea: ['5000>'],
                partnerarea: ['5000>'],
                element: [2610],
                item: [552],
                year: [2013]
            }).then(function(d) {

                amplify.publish(E.LOADING_HIDE, {container: '#sigma'});

                var colors = ['#0d6cac'];
               _.each(d.data, function(v, index) {

                   var siblingID = v['Reporter Country Code'] + '_' + v['Element Code'],
                       siblingLabel = v['Reporter Countries'],
                       id = v['Partner Country Code'] + '_' + v['Element Code'],
                       size = v['Value'];

                   if (size > 0 ) {

                       log.info(siblingID, id, v['Partner Countries'], v['Value']);

                       if (!nodesCache.hasOwnProperty(siblingID)) {

                           nodesCache[siblingID] = {
                               id: siblingID,
                               label: siblingLabel,
                               x: Math.random(),
                               y: Math.random(),
                               size: v['Value'],
                               alternateSize: 0,
                               color: colors[0]
                           };

                       }else{

                          nodesCache[siblingID].size = v['Value'] + nodesCache[siblingID]['size'];

                       }
                       if (!nodesCache.hasOwnProperty(id)) {

                           nodesCache[id] = {
                               id: id,
                               label: v['Partner Countries'],
                               x: Math.random(),
                               y: Math.random(),
                               size: 0,
                               alternateSize: v['Value'],
                               //color: colors[0]
                               color: colors[0]

                           };

                       }else{

                           nodesCache[id].alternateSize = v['Value'] + nodesCache[id]['size'];

                       }

                       var edge = {
                           "id": "e" + index,
                           "source": nodesCache[siblingID]['id'],
                           "target": nodesCache[id]['id'],
                           size: v['Value'],
                           color: '#ccc'
                       };

                       //log.info(edge.source, edge.target);
                       data.edges.push(edge);
                   }

               });

                _.each(nodesCache, function (node) {

                    node.originalSize = node.size;
                    var size = isAlternateSize? node.alternateSize: node.size;

                    node.label = node.label + " - " + size;
                    node.size = size;

                    data.nodes.push(node);

                });

                var s = new sigma({
                    graph: data,
                    renderer: {
                        // IMPORTANT:
                        // This works only with the canvas renderer, so the
                        // renderer type set as "canvas" is necessary here.
                        container: 'sigma',
                        //type: 'canvas',
                        type: 'svg',
                        freeStyle: true
                    },
                    settings: {
                       // defaultNodeColor: '#ccc',
/*                        animationsTime: 5000,
                        doubleClickEnabled: false,
                        enableEdgeHovering: true,
                        edgeHoverColor: 'edge',
                        defaultEdgeHoverColor: '#000',
                        edgeHoverSizeRatio: 1,
                        edgeHoverExtremities: true,*/
                        labelThreshold: 0,

                        /*animationsTime: 1000,
                        borderSize: 2,
                        outerBorderSize: 3,
                        defaultNodeOuterBorderColor: 'rgb(236, 81, 72)',
                        enableEdgeHovering: true,
                        edgeHoverHighlightNodes: 'circle',
                        sideMargin: 1,
                        edgeHoverColor: 'edge',
                        defaultEdgeHoverColor: '#000',
                        edgeHoverSizeRatio: 1,
                        edgeHoverExtremities: true,
                        scalingMode: 'outside',*/
                        //drawEdges: false,
                        enableHovering: false
                    }
                });

               /* s.addRenderer({
                    id: 'main',
                    type: 'svg',
                    container: document.getElementById('sigma'),
                    freeStyle: true
                });*/

                s.configForceAtlas2({
                    adjustSizes: true,
                    strongGravityMode: true

                });
                s.startForceAtlas2();

                setTimeout(function() {
                    s.killForceAtlas2();
                    s.stopForceAtlas2();
                }, 4000);

               /* var isRunning = true;
                    document.getElementById('stop-layout').addEventListener('click',function(){
                        if(isRunning){
                            isRunning = false;
                            s.stopForceAtlas2();
                            document.getElementById('stop-layout').childNodes[0].nodeValue = 'Start Layout';
                        }else{
                            isRunning = true;
                            s.startForceAtlas2();
                            document.getElementById('stop-layout').childNodes[0].nodeValue = 'Stop Layout';
                        }
                    },true);
                    document.getElementById('rescale-graph').addEventListener('click',function(){
                        s.position(0,0,1).draw();
                    },true);
*/

                // Binding silly interactions
                function mute(node) {

                    log.info("mute function")
                    if (!~node.getAttribute('class').search(/muted/))
                        node.setAttributeNS(null, 'class', node.getAttribute('class') + ' muted');
                }

                function unmute(node) {
                    log.info("unmute function")
                    node.setAttributeNS(null, 'class', node.getAttribute('class').replace(/(\s|^)muted(\s|$)/g, '$2'));
                }

                $('.sigma-node').click(function() {

                    // Muting
                    $('.sigma-node, .sigma-edge').each(function() {
                        log.info("Muting");
                        mute(this);
                    });

                    // Unmuting neighbors
                    var neighbors = s.graph.neighborhood($(this).attr('data-node-id'));
                    neighbors.nodes.forEach(function(node) {
                        log.info("unmute1")
                        unmute($('[data-node-id="' + node.id + '"]')[0]);
                    });

                    neighbors.edges.forEach(function(edge) {
                        log.info("unmute2")
                        unmute($('[data-edge-id="' + edge.id + '"]')[0]);
                    });
                });

                s.bind('clickStage', function() {
                    log.info("clickStage")
                    $('.sigma-node, .sigma-edge').each(function() {
                        log.info("clickStage");
                        unmute(this);
                    });

                    s.refresh();
                });

            });

            /*var data = {
                "nodes": [
                    {
                        "id": "n0",
                        "label": "A node",
                        "x": Math.random(),
                        "y": Math.random(),
                        "size": 3
                    },
                    {
                        "id": "n1",
                        "label": "Another node",
                        "x": Math.random(),
                        "y": Math.random(),
                        "size": 2
                    },
                    {
                        "id": "n3",
                        "label": "Another node",
                        "x": Math.random(),
                        "y": Math.random(),
                        "size": 10000
                    }
                ],
                "edges": [
                    {
                        "id": "e0",
                        "source": "n0",
                        "target": "n1"
                    }
                ]
            }

            var s = new sigma({
                graph: data,
                container: 'sigma',
                settings: {
                    defaultNodeColor: '#ccc'
                }
            });*/

        },

        initReleaseCalendar: function() {

            this.$el.append('calendard<div class="col-md-12" id="calendar"></div>');
            var c = new ReleaseCalendar();
            c.render({
                container: '#calendar'
            });
        },

        initDashBoardComposer: function() {

            this.$el.append('dashboard<div class="row"><div class="col-md-12" id="dashboard-composer"></div></div>');
            var d = new DashBoardComposer(),
                config = {

                    "comment": {
                        "text": {
                            "en": "Emissions of methane and nitrous oxide produced from agricultural activities",
                            "es": "Emisiones de metano y óxido nitroso producido por las actividades agrícolas",
                            "fr": "Émissions de méthane et d'oxyde nitreux provenant des activités agricoles"
                        }
                        //,pdf: "GT.pdf"
                    },

                    filter: {

                        defaultFilter: {
                            "domain_code": ["QD"],
                            "show_lists": false
                        },

                        items: [
                            {
                                // id to be applied on the getData request
                                "id": "item",
                                "type": "codelist",
                                "parameter": "item",
                                //"title": "title",
                                "componentType": {
                                    "class": "col-xs-6 col-sm-6 col-md-3",
                                    "type": "dropDownList",
                                    "multiple": false
                                },
                                "config": {
                                    "dimension_id": "items",
                                    "defaultCodes": ["290"],
                                    "filter": {
                                    }
                                }
                            },
                            {
                                "id": "area",
                                "type": "codelist",
                                "parameter": "area",
                                "componentType": {
                                    "class": "col-xs-6 col-sm-6 col-md-3",
                                    "type": "dropDownList",
                                    "multiple": false
                                },
                                "config": {
                                    "dimension_id": "area",
                                    "defaultCodes": ["5000"],
                                    "filter": {
                                    }
                                }
                            },
                            {
                                "id": "year",
                                "type": "codelist",
                                "parameter": "year",
                                "componentType": {
                                    "class": "col-xs-4 col-sm-4 col-md-2",
                                    "type": "dropDownList-timerange"
                                },
                                "config": {
                                    "dimension_id": "year",
                                    "defaultCodes": ['1993'],
                                    "filter": {
                                    }
                                }
                            }
                        ]
                    },

                    dashboard: {

                        //data base filter
                        defaultFilter: {
                            domain_code: ['QD'],
                            element: ["2510"]
                        },

                        items: [
                            {
                                type: 'chart',
                                class: "col-md-12",

                                // labels
                                labels: {
                                    // template to be applied to the config.template for the custom object
                                    template: {
                                        title: {
                                            en: "Production quantities of {{item}} in {{area}}",
                                            fr: "Production de {{item}} dans le {{area}}",
                                            es: "Producción de {{item}} en {{area}}"
                                        },
                                        subtitle: "{{year}}"
                                    }
                                },

                                config: {
                                    adapter: {
                                        adapterType: 'faostat',
                                        type: "timeserie",
                                        xDimensions: 'year',
                                        yDimensions: 'unit',
                                        valueDimensions: 'value',
                                        seriesDimensions: ['area', 'item', 'element']
                                    },
                                    template: {
                                        // height:'350px'
                                        // default labels to be applied
                                    },
                                    creator: {}
                                },
                                allowedFilter: ['area', 'year', 'item'],
                                filter: {
                                }
                            }
                        ]
                    }

                };
            d.render($.extend(true, {}, config, {container: '#dashboard-composer'}));

            //this.$el.append('<br><br><div id="dashboard-composer2"></div>');
           // var d2 = new DashBoardComposer();
           // d2.init($.extend({}, config, {container: '#dashboard-composer2'}));

        },

        initFiltersBox: function() {

            this.$el.append('<div id="filter-box"></div>');
            var filterBox = new FilterBox();
            filterBox.render({

                container: '#filter-box',
                defaultFilter: {
                    "domain_code": ["AF"],
                    "show_lists": false
                },

                items: [
                    {
                        "id": "area",
                        "type": "codelist",
                        "parameter": "List1Codes",
                        "componentType": {
                            "class": "col-lg-3",
                            "type": "dropDownList",
                            "multiple": false
                        },
                        "config": {
                            "dimension_id": "area",
                            "defaultCodes": ["4"],
                            "filter": {
                                "show_lists": false
                            }
                        }
                    }
                ]
            }).then(function(v){

            });


        },

        initFilters: function() {

/*            this.$el.append('filter<br><div id="filter"></div>');

            var filterBox = new FilterBox();
            filterBox.render({
                container: "#filter",
                filter: {
                    items: [{
                        "id": "item",
                        "type": "codelist",
                        "parameter": "List3Codes",
                       // "componentType": {
                           // "class": "col-lg-3",
                           // "type": "dropDownList"
                       // },
                        "config": {
                            //"dimension_id": "item",
                            "defaultCodes": ["27"],
                            "filter": {
                                "domain_code": "QC"
                            }
                        }
                    }]
                }
            }, false);*/


            /*this.$el.append('<div id="filter"></div>');
            var filter = new Filter();
            filter.render({
                container: "#filter",
                filter: {
                        "id": "item",
                        "type": "codelist",
                        "parameter": "List3Codes",
                        // "componentType": {
                        // "class": "col-lg-3",
                        // "type": "dropDownList"
                        // },
                        "config": {
                            "dimension_id": "item",
                            "defaultCodes": ["27"],
                            "filter": {
                                "domain_code": "QC",
                                "show_lists": false
                            }
                        }
                }
            }).then(function(v){
            });*/

            this.$el.append('<div id="filter-year"></div>');
            var filterYear = new Filter();
            filterYear.render({
                container: "#filter-year",
                filter: {
                    "id": "year",
                    //"type": "remote",
                    "parameter": "List3Codes",
                     "componentType": {
                         "type": "dropDownList-timerange"
                     },
                    "config": {
                        "dimension_id": "year",
                        "filter": {
                            "domain_code": "QC"
                        }
                    }
                }
            }).then(function(v){
            });


        },

        initTable: function() {

            this.$el.append('<div id="test1"></div>');
            var t = new Table();
            t.render({
                model: {"metadata": {"processing_time": 203,"dsd": [{"label": "Domain Code","type": "code","key": "Domain Code"},{"label": "Domain","type": "label","key": "Domain"},{"label": "Country Code","type": "code","key": "Country Code","dimension_id": "area"},{"label": "Country","type": "label","key": "Country","dimension_id": "area"},{"label": "Element Code","type": "code","key": "Element Code","dimension_id": "element"},{"label": "Element","type": "label","key": "Element","dimension_id": "element"},{"label": "Item Code","type": "code","key": "Item Code","dimension_id": "item"},{"label": "Item","type": "label","key": "Item","dimension_id": "item"},{"label": "Year Code","type": "code","key": "Year Code","dimension_id": "year"},{"label": "Year","type": "label","key": "Year","dimension_id": "year"},{"label": "Unit","key": "Unit","type": "unit","dimension_id": "unit"},{"label": "Value","type": "value","key": "Value","dimension_id": "value"},{"label": "Flag","key": "Flag","type": "flag","dimension_id": "flag"},{"label": "Flag Description","type": "flag_label","key": "Flag Description","dimension_id": "flag"}],"output_type": "OBJECTS"},"data": [{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1990","Year":"1990","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1991","Year":"1991","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1992","Year":"1992","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1993","Year":"1993","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1994","Year":"1994","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1995","Year":"1995","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1996","Year":"1996","Unit":"index","Value":0.82,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1997","Year":"1997","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1998","Year":"1998","Unit":"index","Value":0.67,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1999","Year":"1999","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2000","Year":"2000","Unit":"index","Value":0.74,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2001","Year":"2001","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2002","Year":"2002","Unit":"index","Value":0.85,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2003","Year":"2003","Unit":"index","Value":0.18,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2004","Year":"2004","Unit":"index","Value":0.34,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2005","Year":"2005","Unit":"index","Value":0.38,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2006","Year":"2006","Unit":"index","Value":0.57,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2007","Year":"2007","Unit":"index","Value":0.55,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2008","Year":"2008","Unit":"index","Value":0.53,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2009","Year":"2009","Unit":"index","Value":0.47,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2010","Year":"2010","Unit":"index","Value":0.67,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2011","Year":"2011","Unit":"index","Value":0.59,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2012","Year":"2012","Unit":"index","Value":0.55,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2013","Year":"2013","Unit":"index","Value":0.42,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2014","Year":"2014","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2015","Year":"2015","Unit":"index","Flag":"NA","Flag Description":"Not applicable"}]},
                container: "#test1",
                adapter: {
                   // columns: ['item', 'element'],
                    show_codes: true
                }
            });
/*
            this.$el.append('<div id="test2"></div>')
            var t2 = new Table();
            t2.render({
                model: {"metadata": {"processing_time": 203,"dsd": [{"label": "Domain Code","type": "code","key": "Domain Code"},{"label": "Domain","type": "label","key": "Domain"},{"label": "Country Code","type": "code","key": "Country Code","dimension_id": "area"},{"label": "Country","type": "label","key": "Country","dimension_id": "area"},{"label": "Element Code","type": "code","key": "Element Code","dimension_id": "element"},{"label": "Element","type": "label","key": "Element","dimension_id": "element"},{"label": "Item Code","type": "code","key": "Item Code","dimension_id": "item"},{"label": "Item","type": "label","key": "Item","dimension_id": "item"},{"label": "Year Code","type": "code","key": "Year Code","dimension_id": "year"},{"label": "Year","type": "label","key": "Year","dimension_id": "year"},{"label": "Unit","key": "Unit","type": "unit","dimension_id": "unit"},{"label": "Value","type": "value","key": "Value","dimension_id": "value"},{"label": "Flag","key": "Flag","type": "flag","dimension_id": "flag"},{"label": "Flag Description","type": "flag_label","key": "Flag Description","dimension_id": "flag"}],"output_type": "OBJECTS"},"data": [{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1990","Year":"1990","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1991","Year":"1991","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1992","Year":"1992","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1993","Year":"1993","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1994","Year":"1994","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1995","Year":"1995","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1996","Year":"1996","Unit":"index","Value":0.82,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1997","Year":"1997","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1998","Year":"1998","Unit":"index","Value":0.67,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"1999","Year":"1999","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2000","Year":"2000","Unit":"index","Value":0.74,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2001","Year":"2001","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2002","Year":"2002","Unit":"index","Value":0.85,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2003","Year":"2003","Unit":"index","Value":0.18,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2004","Year":"2004","Unit":"index","Value":0.34,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2005","Year":"2005","Unit":"index","Value":0.38,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2006","Year":"2006","Unit":"index","Value":0.57,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2007","Year":"2007","Unit":"index","Value":0.55,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2008","Year":"2008","Unit":"index","Value":0.53,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2009","Year":"2009","Unit":"index","Value":0.47,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2010","Year":"2010","Unit":"index","Value":0.67,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2011","Year":"2011","Unit":"index","Value":0.59,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2012","Year":"2012","Unit":"index","Value":0.55,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2013","Year":"2013","Unit":"index","Value":0.42,"Flag":"","Flag Description":"Official data"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2014","Year":"2014","Unit":"index","Flag":"NA","Flag Description":"Not applicable"},{"Domain Code":"FS","Domain":"Suite of Food Security Indicators","Country Code":"68","Country":"France","Element Code":"6125","Element":"Value","Item Code":"21032","Item":"Political stability and absence of violence/terrorism (index)","Year Code":"2015","Year":"2015","Unit":"index","Flag":"NA","Flag Description":"Not applicable"}]},
                container: "#test2",
                adapter: {
                    // columns: ['item', 'element'],
                    show_codes: true
                },
                temaplate: {
                    table: {

                    }
                }
            });*/

            //'datatables-colreorder',



        },


        testQueries: function () {

           /* $.ajax({
                url: "http://168.202.39.159:8081/faostat-api/v1/en/data/QC",
                contentType: "application/json",
                traditional:true,
                data: {
                    datasource: "internal",
                    area: [2],
                    year: [2011,2010],
                    item: [27],
                    element: [2510]
                },
                success: function(result){
                    log.info(result);
                },
                error: function(error) {
                    log.error(error);
                }
            });*/


          /*  $.ajax({
                url: "http://168.202.39.159:8081/faostat-api/v1/en/data/QC",
                //contentType: "application/json",
                //traditional:true,
                data: {
                    datasource: "internal",
                    area: [2],
                    year: [2011,2010],
                    item: [27],
                    element: [2510]
                },
                success: function(result){
                    log.info(result);
                },
                error: function(error) {
                    log.error(error);
                }
            });*/

            Q.all([
                API.codes({id: 'area', domain_code: 'QC', show_lists: false}),
                API.codes({id: 'year', domain_code: 'QC', show_lists: false}),
                API.codes({id: 'item', domain_code: 'QC', show_lists: false})
            ]).then(function(codes) {

                log.info(codes)

                var area = _.pluck(codes[0].data, 'code');
                var year = _.pluck(codes[1].data, 'code');
                var item = _.pluck(codes[2].data, 'code');

                log.info(area);
                log.info(year);
                log.info(item);


                API.data({
                    datasource: "internal",
                    domain_code: "QC",
                    area: area,
                    year: year,
                    item: item,
                    element: [2510],
                    no_records: true
                }).then(function(d) {
                    log.info(d);

                }).fail(function(e) {
                    log.error(e);
                });
            });

           /*

            API.data_new({
                datasource: "internal",
                domain_code: "QC",
                area: [2],
                year: [2011,2010],
                item: [27],
                element: [2510]
            }).then(function(d) {
                log.info(d)

            });*/


            /*$.ajax({
             url: "http://fenixservices.fao.org/faostat/api/v1/en/data/",
             data: JSON.stringify(
             {"datasource":"production","domain_codes":["QC"],"filters":{"area":["2"],"item":["15"],"year":["2010"]}}
             ),
             contentType: "application/json",
             type: 'POST',
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });*/


           /* API.definitions({
                datasource: "production"
            }).then(function(d) {
                log.info(d)

            });

            API.definitions({
                datasource: "internal"
            }).then(function(d) {
                log.info(d)

            });

            API.definitions_by_type({
                datasource: "production",
                type: "abbreviation"
            }).then(function(d) {
                log.info(d)

            });*/


            /*  api.data_get({
             domain: 'QC',
             datasource: "test",
             area: [2],
             year: [2010]
             }).then(function(d) {

             log.info(d)

             });

             $.ajax({
             url: "http://localhost:8081/faostat-api/v1/en/data/CS",
             contentType: "application/json",
             data: {
             datasource: "test",
             area: [2],
             year: [2010]},
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });

             $.ajax({
             url: "http://localhost:8081/faostat-api/v1/en/data/CS",
             contentType: "application/json",
             data: {
             datasource: "test",
             area: [2, 3],
             year: [2010]
             },
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });

             $.ajax({
             url: "http://localhost:8081/faostat-api/v1/en/data/CS",
             contentType: "application/json",
             data: {
             datasource:"test"
             },
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });

             $.ajax({
             url: "http://localhost:8081/faostat-api/v1/en/data/QC",
             contentType: "application/json",
             data: {
             datasource:"test",
             area: ["5100>"],
             },
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });

             $.ajax({
             url: "http://localhost:8081/faostat-api/v1/en/data/TP",
             contentType: "application/json",
             data: {
             datasource:"test",
             year: ["2010"],
             },
             success: function(result){
             log.info(result);
             },
             error: function(error) {
             log.error(error);
             }
             });

             var api = new FAOSTATApi();*/

            /* api.data({
             "datasource":"production",
             "domain_codes":["QC"],
             "filters":{"area":["2"],
             "item":["15"],
             "year":["2010"]
             }
             })*/

            /*  api.data({
             domain_codes: ['QC'],
             filters: {
             area: ['5000>'],
             elements: ['2510'],
             items: ['15'],
             //years: ['2012']
             },

             //output_type: 'csv'
             }).then(function (response) {
             log.info(response)
             });*/

            /*  api.databean({
             domain_codes: ['QC'],
             List1Codes: ['2'],
             List2Codes: ['2510'],
             List3Codes: ['15'],
             List4Codes: ['2010'],
             List5Codes: null,
             List6Codes: null,
             List7Codes: null,
             List1AltCodes: ['ISO3'],
             page_size: 10
             //output_type: 'csv'
             }).then(function (response) {
             log.info(response);
             });*/


            /*var reportTable = new ReportTable();

             reportTable.init({
             container: this.$el,
             request: {
             domain_code: 'fbs',
             List1Codes: [33],
             List2Codes: [2009]
             }
             });


             reportTable.render();
             //reportTable.export();*/

        },


        initComponents: function () {

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {


        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return IndicatorsView;

});
