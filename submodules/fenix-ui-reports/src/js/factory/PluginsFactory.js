define(['fx-rp-metadata', 'fx-rp-table', 'fx-rp-surveyFMD'],
    function (Metadata, Table, FMD) {

        'use strict';

        var PluginRegistry = {
            'metadataExport': Metadata,
            'tableExport': Table,
            'fmdExport': FMD
        };

        return function (pluginName) {
            return new PluginRegistry[pluginName];
        };
    })