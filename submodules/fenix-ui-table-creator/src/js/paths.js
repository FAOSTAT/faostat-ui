/*global define*/
define(function () {

    var config = {

        paths: {
            'fx-t-c/start': './start',
            'fx-t-c/html': '../html',
            'fx-t-c/config': '../../config',
            'fx-t-c/adapters': './adapters',
            'fx-t-c/templates': './templates',
            // third party libs
            text: '//fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text',
            jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
            jqwidgets: '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light',//,
            'jqxmenu': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqxmenu',
            'jqxgrid.pager': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqxgrid.pager',
           'jqxgrid.filter': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqxgrid.filter',
           'jqxgrid.grouping': '//fenixapps.fao.org/repository/js/jqwidgets/3.1/jqxgrid.grouping',

            underscore: "//fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
            moment: "//fenixapps.fao.org/repository/js/moment/2.9.0/moment.min",
            amplify: "//fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min"

        },

        shim: {
            "jqwidgets": {
                "deps": ["jquery"]
            },
            "jqxmenu": {
                "deps": ["jqwidgets"]
            },
            "jqxgrid.pager": {
                "deps": ["jqwidgets"]
            },
            "jqxgrid.filter": {
                "deps": ["jqwidgets"]
            },
            "jqxgrid.grouping": {
                "deps": ["jqwidgets"]
            },
            "amplify": {
                "deps": ["jquery"]
            }
        }
    };

    return config;
});
