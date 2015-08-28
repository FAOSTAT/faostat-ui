/*global require*/
require([
    'js/paths'
], function (Paths) {

    require.config(Paths);

    require.config( {
        paths:  {

            'fx-menu/start': './js/start',
            'fx-menu/templates': './templates/',

            'jquery': './node_modules/jquery/dist/jquery.min',
            'bootstrap': './node_modules/bootstrap/dist/js/bootstrap.min',
            'text': "./node_modules/text/text"
        }
    });

    require([
        'js/start'
    ], function (Menu) {

        new Menu({
            url: 'config/default.json',
            active: "home"
        });

    });

});