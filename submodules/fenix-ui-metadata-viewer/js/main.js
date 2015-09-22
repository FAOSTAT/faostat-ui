var root = '../../';

require.config({

    baseUrl: 'js/libs',

    paths: {

        FENIX_UI_METADATA_VIEWER: root + 'fenix-ui-metadata-viewer',
        fenix_ui_metadata_viewer: root

    }

});

require(['FENIX_UI_METADATA_VIEWER'], function(FUIMDV) {
    var fuimdv = new FUIMDV();
    fuimdv.init({
        placeholder_id: 'placeholder'
    });
});