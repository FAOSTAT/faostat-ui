/*global require,document, console*/
require.config({

    baseUrl: 'js/libs',

    paths: {

        rest_client: '../latest/FAOSTATAPIClient'

    },

    shim: {
        rest_client: ['jquery', 'q'],
        jbPivot: ['jquery', 'jquery-ui'],
        q: {
            deps: ['jquery'],
            exports: 'q'
        }
    }

});

require(['jquery', 'rest_client', 'jbPivot'], function ($, RESTClient) {

    'use strict';

    var c = new RESTClient(),
        config = {
            domain_code: 'QC',
            List1Codes: ['2', '7', '10', '21', '174'],
            List2Codes: ['2510', '2312', '2413', '2525'],
            List3Codes: ['15', '515', '27'],
            List4Codes: ['2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003'],
            List5Codes: null,
            List6Codes: null,
            List7Codes: null,
            limit: -1,
            datasource: 'test',
            thousand_separator: '.',
            decimal_separator: ',',
            output_type: 'objects'
        };
    //try {
    c.data(config).then(function (json) {
        var i;
        for (i = 0; i < json.data.length; i += 1) {
            console.debug(json.data[i].Value);
            json.data[i].Value = parseFloat(json.data[i].Value);
            console.debug(json.data[i].Value);
        }
        //console.debug(json.data);
        //console.debug(json.data[0].Value);
        //document.getElementById('placeholder').innerHTML = JSON.stringify(json);
        $('#placeholder').jbPivot({
            fields: {
                Country : {field: 'Country', sort: 'asc', showAll: true, agregateType: 'distinct'},
                Item : {field: 'Item', sort: 'asc', showAll: true, agregateType: 'distinct'},
                Element : {field: 'Element', sort: 'asc', showAll: true, agregateType: 'distinct'},
                Unit : {field: 'Unit', sort: 'asc', showAll: true, agregateType: 'distinct'},
                Year : {field: 'Year', sort: 'desc', showAll: true, agregateType: 'distinct'},
                average: {field: 'Value', agregateType: 'average', groupType: 'none', label: 'Value', formatter: function (V, f) {
                    var res = null;
                    if (typeof (V) === "number") {
                        res = V.toFixed(2);
                    }
                    return res;
                }}
            },
            xfields: ['Country', 'Year'],
            yfields: ['Element', 'Item'],
            zfields: ['average', 'Unit'],
            data: json.data
        });
    });
    //} catch (e) {
    //    console.debug(e);
    //}

});