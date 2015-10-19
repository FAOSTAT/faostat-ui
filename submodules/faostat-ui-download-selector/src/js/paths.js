define(function() {

    var config = {
        paths: {
            FAOSTAT_UI_DOWNLOAD_SELECTOR: 'start',
            faostat_ui_download_selector: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

    return config;

});