require.config({
    baseUrl: '../src',
    paths: {
        'jquery': ['../test/js/libs/jquery.min'],
        'jasmine': ['../test/js/libs/jasmine'],
        'jasmine-html': ['../test/js/libs/jasmine-html'],
        'jasmine-boot': ['../test/js/libs/boot'],
        'faostat-api-client-spec': ['../test/js/spec/FAOSTATAPIClientSpec']
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});

require(['jasmine-boot'], function () {
    require(['faostat-api-spec'], function () {
        window.onload();
    })
});