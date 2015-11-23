/*global define*/
define(function () {

    'use strict';

    var config = {

        paths: {
            'fx-common': './',
            'fx-common/html': '../html',
            'fx-common/config': '../config',
            'faostat_commons': 'FAOSTATCommons',

            // third party libs
            'jquery':    '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'amplify':   '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.3.2/js/bootstrap.min',
            'moment':    '{FENIX_CDN}/js/moment/2.9.0/moment.min',
            'SparkMD5' : '{FENIX_CDN}/js/spark-md5/spark-md5.min',
            'q':         '{FENIX_CDN}/js/q/1.1.2/q',

            //AuthManager
            'fx-common/config/auth_users': '../config/auth_users.json',
            //jsonForm
            'jsoneditor':              '{FENIX_CDN}/js/json-editor/0.7.21/jsoneditor.min',
            'bootstrap-datetimepicker':'{FENIX_CDN}/js/bootstrap-datetimepicker/4.14.30/build/js/bootstrap-datetimepicker.min',

            //fx-upload-client
            'jquery.scrollto':         '{FENIX_CDN}/js/jquery.scrollto/2.1.1/jquery.scrollTo.min',
            'jquery.ui.widget':        '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/vendor/jquery.ui.widget',
            'jquery.fileupload':       '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload',
            'jquery.fileupload-ui':    '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-ui',
            'jquery.iframe-transport':    '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.iframe-transport',
            'jquery.fileupload-image':    '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-image',
            'jquery.fileupload-audio':    '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-audio',
            'jquery.fileupload-video':    '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-video',
            'jquery.fileupload-process':  '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-process',
            'jquery.fileupload-validate': '{FENIX_CDN}/js/jquery-file-upload/9.10.4/js/jquery.fileupload-validate',


            'draggabilly': '{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min',
            'packery': '{FENIX_CDN}/js/packery/dist/packery.pkgd.min'

        },

        shim: {
            'amplify': ['jquery'],
            'jsoneditor': {
                deps: ['jquery','bootstrap'],
                exports: 'JSONEditor'
            },
            'bootstrap-datetimepicker': ['jquery','bootstrap','moment'],
            'jquery.fileupload': {
                deps: ["jquery", "jquery.ui.widget" /*, 'jquery.fileupload-ui', 'jquery.iframe-transport'*/]
            },
            'jquery.scrollto': {
                deps: ["jquery"]
            }
        }
    };

    return config;
});
