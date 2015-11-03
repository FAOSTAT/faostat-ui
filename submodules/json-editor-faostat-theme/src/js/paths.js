define(function() {

    var config = {
        paths: {
            FAOSTAT_THEME: 'faostat-theme',
            faostat_theme: '../',
            sweetAlert: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.min'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            jsonEditor: {
                deps: ['jquery', 'bootstrap']
            }
        }
    };

    return config;

});