/*global define*/
define(['fx-m-c/config/config', 'fx-m-c/config/config-default'], function (C, DC) {

    'use strict';
    return {

        fenix_ui_map: {

            plugins: {
                disclaimerfao: false,
                geosearch: false,
                mouseposition: false,
                controlloading: true,
                zoomcontrol: 'bottomright',
                scalecontrol: false
            },
            guiController: {
                overlay: false,
                baselayer: false,
                wmsLoader: false
            },
            gui: {
                disclaimerfao: false
            }
        },
        leaflet: {
            zoomControl: false,
            attributionControl: true,
            minZoom: 1
        },
        layers: {
            boundary: {
                layers: 'fenix:gaul0_line_3857',
                layertitle: 'Country Boundaries',
                // TODO: remove the url to wms
                urlWMS: ( C.WMS_URL || DC.WMS_URL ),
                //styles: 'gaul0_line_white',
                opacity: '0.3',
                lang: 'en'
            }
        },
        url: {
            wms: C.WMS_URL || DC.WMS_URL
        },
        geoSubject: 'geo',
        valueSubject: 'value',
        // measurement unit
        muSubject: null,

        // Mapping with the
        join: {

            layerMapping: {
                faostat3: {
                    'en': {
                        layers: 'fenix:gaul0_faostat3_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamee'
                    },
                    'fr': {
                        layers: 'fenix:gaul0_faostat3_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamef'
                    },
                    'es': {
                        layers: 'fenix:gaul0_faostat3_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanames'
                    }
                },
                faostat: {
                    'en': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamee'
                    },
                    'fr': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamef'
                    },
                    'es': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanames'
                    },
                    'ru': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamee'
                    },
                    'ar': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamee'
                    },
                    'zh': {
                        layers: 'fenix:gaul0_faostat_3857',
                        joincolumn: 'faost_code',
                        joincolumnlabel: 'areanamee'
                    }
                }
            },
            style: {
                layertype: 'JOIN',
                jointype: 'shaded',
                defaultgfi: true,
                openlegend: true,
                lang: 'EN',
                opacity: '0.75',
                colorramp: 'YlOrRd',
                // colorramp: 'Blues',
                // colorramp: 'GnBu',
                // colorramp: 'YlGnBu',
                //colorramp: 'Blues',
                //colorramp: 'PuBu',
                //colorramp: 'YlGnBu',
                decimalvalues: 2,
                intervals: 5
            }
        }

        // TODO: add boundaries option

    };
});