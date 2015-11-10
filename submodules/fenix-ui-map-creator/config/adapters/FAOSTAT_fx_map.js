/*global define*/
define(['fx-m-c/config/config', 'fx-m-c/config/config-default'],function (C,DC) {

    'use strict';

    return {

        fenix_ui_map: {

            plugins: {
                disclaimerfao: true,
                geosearch: true,
                mouseposition: false,
                controlloading : true,
                zoomcontrol: 'bottomright'
            },
            guiController: {
                overlay: false,
                baselayer: true,
                wmsLoader: false
            },
            gui: {
                disclaimerfao: true
            }
        },
        leaflet: {
            zoomControl: false,
            attributionControl: false,
            minZoom: 1
        },
        layers: {
            boundary: {
                layers: 'fenix:gaul0_line_3857',
                layertitle: 'Country Boundaries',
                // TODO: remove the url to wms
                urlWMS: ( C.SERVER || DC.SERVER ) + '/geoserver-demo',
                opacity: '0.9',
                lang: 'en'
            },
            gaul0: {
                layers: 'fenix:gaul0_faostat_3857',
                // TODO: remove the url to wms
                urlWMS: ( C.SERVER || DC.SERVER ) + '/geoserver-demo',
                opacity: '0.9',
                joincolumn: 'adm0_code',
                joincolumnlabel: 'areanamee',
                layertype: 'JOIN',
                jointype: 'shaded',
                openlegend: true,
                defaultgfi: true,
                colorramp: 'YlGn',
                lang: 'en'
            }
        },
        url: {
            wms: C.WMS_URL ||  DC.WMS_URL
        },
        geoSubject: 'geo',
        valueSubject: 'value',
        // measurement unit
        muSubject: null,

        // Mapping with the
        join: {

            layerMapping: {
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
                    }
                }
            },
            style: {
                layertype: 'JOIN',
                jointype: 'shaded',
                defaultgfi: true,
                openlegend: true,
                lang: 'EN',
                opacity: '0.7',
                colorramp: 'Greens',
                decimalvalues: 2
            }
        }
        // TODO: add boundaries option
    };
});