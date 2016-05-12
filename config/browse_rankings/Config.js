/*global define*/
define([
    'jquery',
    'config/submodules/fx-chart/highcharts_template',
    'i18n!nls/browse_rankings'
], function ($, HighchartsTemplate, i18n) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_rankings/prod/views/',

        "defaultCode": "commodities_by_regions",

        // default cofing to be applied to each view
        view: {

            map: {
                leaflet: {
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    minZoom: 1
                },
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat'
                },
                template: {
                    class: 'test',
                    height: '350px',
                    footer: i18n.map_footer,
                    addExport: true,
                    export: i18n.export_data
                }
            },
            chart: {
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat'
                },
                creator: {
                    chartObj: HighchartsTemplate
                },
                template: {
                    height: '300px',
                    addExport: true,
                    export: i18n.export_data
                }
            },

            table: {
                adapter: {},
                template: {
                    addExport: true,
                    export: i18n.export_data
                }
            }

        },

        // configuration of the rankings' tree
        tree: {

            "options" : {
                "open_all": true
            },

            "config": [
                {
                    "id": "1",
                    "title": {
                        "en": "Food and Agricultural commodities production",
                        "es": "Producción de productos alimentarios y agrícolas",
                        "fr": "Alimentation et production agricole"
                    },
                    "views": [
                       /* {
                            title: {
                                "en": "Commodities by regions",
                                "es": "Productos por regiones",
                                "fr": "Produits par régions"
                            },
                            "id": "commodities_by_regions"
                        },*/
                        {
                            title: {
                                "en": "Commodities by country",
                                "es": "Productos por país",
                                "fr": "Produits par pays"
                            },
                            "id": "commodities_by_country"
                        },
                        {
                            title: {
                                "en": "Countries by commodity",
                                "es": "Países por producto",
                                "fr": "Pays par produits"
                            },
                            "id": "countries_by_commodity"
                        }
                    ]
                },
                {
                    "id": "2",
                    "title": {
                        "en": "Imports",
                        "es": "Importaciones",
                        "fr": "Importations"
                    },
                    "views": [
                        {
                            title: {
                                "en": "Commodities by regions",
                                "es": "Productos por Regiones",
                                "fr": "Produits par regions"
                            },
                            "id": "commodities_by_regions_imports"
                        },
                        {
                            title: {
                                "en": "Commodities by country",
                                "es": "Productos por país",
                                "fr": "Produits par pays"
                            },
                            "id": "commodities_by_country_imports"
                        },
                        {
                            title: {
                                "en": "Major commodities importers",
                                "es": "Mayores importadores de productos",
                                "fr": "Principaux importateurs des produits"
                            },
                            "id": "major_commodities_imports"
                        }
                    ]
                },
                {
                    "id": "3",
                    "title": {
                        "en": "Exports",
                        "es": "Exportaciones",
                        "fr": "Exportations"
                    },
                    "views": [
                        {
                            title: {
                                "en": "Commodities by regions",
                                "es": "Productos por Regiones",
                                "fr": "Produits par regions"
                            },
                            "id": "commodities_by_regions_exports"
                        },
                        {
                            title: {
                                "en": "Commodities by country",
                                "es": "Productos por país",
                                "fr": "Produits par pays"
                            },
                            "id": "commodities_by_country_exports"
                        },
                        {
                            title: {
                                "en": "Major commodities exporters",
                                "es": "Mayores exportadores de productos",
                                "fr": "Principaux exportateurs des produits"
                            },
                            "id": "major_commodities_exports"
                        }
                    ]
                }
            ]

        }

    };
});
