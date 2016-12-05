/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RP"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["11"],
                        "filter": {}
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
                        "defaultCodes": [],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['RP']
            },

            items: [
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        default: {
                            footer: {
                                en: "<small><b>Data are expressed in formulated products for the following countries:</b><br><i>Algeria, Bahamas, Bangladesh, Bhutan, Cyprus, Fiji, Jamaica, Mauritius, Mexico, Montenegro, Occupied Palestinian Territory, Panama, Republic of Korea, Serbia and Montenegro, Slovakia, Syrian Arab Republic, Trinidad and Tobago</i></small>",
                                fr: "<small><b>Les données sont exprimées en produits formulés pour les pays suivants:</b><br><i>Algérie, Bahamas, Bangladesh, Bhoutan, Chypre, Fidji, Jamaïque, Maurice, Mexique, Monténégro, Panama, République arabe syrienne, République de Corée, Serbie-et-Monténégro, Slovaquie, Territoire palestinien occupé, Trinité-et-Tobago</i></small>",
                                es: "<small><b>Los datos se expresan en productos formulados para los siguientes países:</b><br><i>Argelia, Bahamas, Bangladesh, Bhután, Chipre, Eslovaquia, Fiji, Jamaica, Mauricio, México, Montenegro, Panamá, República Árabe Siria, República de Corea, Serbia y Montenegro, Territorio Palestino Ocupado, Trinidad y Tabago</i></small>",
                            }
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides use, {{area}}",
                                fr: "Consommation de pesticides, {{area}} ",
                                es: "Consumo de plaguicidas, {{area}} "
                            },
                            subtitle: "{{year}}",
                            footer: "{{{footer}}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        element: [5161],
                        item: [1309, 1320, 1331]
                    }
                }
            ]
        }

    }
});