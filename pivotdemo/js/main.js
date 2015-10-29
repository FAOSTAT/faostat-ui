/*global require,document*/
require.config({

    baseUrl: 'js/libs',

    paths: {

        rest_client: '../latest/FAOSTATAPIClient'

    },

    shim: {
        rest_client: ['jquery', 'q'],
        q: {
            deps: ['jquery'],
            exports: 'q'
        }
    }

});

require(['jquery', 'rest_client'], function ($, RESTClient) {

    'use strict';

    var c = new RESTClient({
            base_url: 'http://localhost:8080/api/v1.0/'
        }),
        i,
        ids = ['countries', 'regions', 'specialgroups'],
        config = {
            domain_code: 'QC',
            List1Codes: ['2', '8'],
            List2Codes: ['2510'],
            List3Codes: ['15'],
            List4Codes: ['2012', '2011', '2010'],
            List5Codes: null,
            List6Codes: null,
            List7Codes: null,
            limit: 10,
            datasource: 'test',
            thousand_separator: '.',
            decimal_separator: ',',
            output_type: 'objects'
        };
    try {
        c.data(config).then(function (json) {
            console.debug(json.data[0].Value);
            console.debug(typeof json.data[0].Value === 'string');
            console.debug(json);
            try {
                document.getElementById('placeholder').innerHTML = JSON.stringify(json);
                document.getElementById('placeholder').innerHTML = json;
            } catch (e) {
                document.getElementById('placeholder').innerHTML = json;
            }
        });
    } catch (e) {
        console.debug(e);
    }

    $('#test_button').click(function () {
        c.domains({
            group_code: 'q',
            blacklist: ['QC', 'QA']
        }).then(function (response) {
            console.debug(response);
        });
        //for (i = 0; i < ids.length; i += 1) {
        //    c.domains({
        //        group_code: 'as',
        //        whitelist: ['AA']
        //    }).then(function (response) {
        //        console.debug(response.data[0].label);
        //        console.debug('');
        //    });
            //$.ajax({
            //    url: 'http://localhost:8080/api/v1.0/en/codes/' + ids[i] + '/qc',
            //    traditional: true,
            //    type: 'GET',
            //    success: function (response) {
            //        console.debug(this.url);
            //        console.debug(response.data[0].label);
            //        console.debug('');
            //    },
            //    error: function (response) {
            //        console.error(response);
            //    }
            //});
        //}
    });

    /* Test codes. */
    //for (i = 0; i < 3; ids.length += 1) {
    //    console.debug('query ' + ids[i]);
    //    $.ajax({
    //        url: 'http://fenixapps2.fao.org/api/v1.0/en/codes/' + ids[i] + '/qc',
    //        traditional: true,
    //        type: 'GET',
    //        success: function (response) {
    //            console.debug(response);
    //        },
    //        error: function (response) {
    //            console.debug(response);
    //        }
    //    });
    //}

});