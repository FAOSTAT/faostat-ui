/*global define*/
define([
    'fenix-ui-map-config'
], function () {

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
                urlWMS: FMCONFIG.DEFAULT_WMS_SERVER,
                //styles: 'gaul0_line_white',
                opacity: '0.5',
                lang: 'en'
            },
            highlight: {
                layers: 'gaul0_faostat_3857',
                layertitle: '',
                urlWMS: FMCONFIG.DEFAULT_WMS_SERVER,
                style: 'highlight_polygon',
                hideLayerInControllerList: true,
                lang: 'en'
            }
        },
        url: {
            wms: FMCONFIG.DEFAULT_WMS_SERVER
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