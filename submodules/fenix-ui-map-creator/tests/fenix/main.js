/*global requirejs, amplify, console*/
requirejs(['../../src/js/paths','../utils'], function (paths, Utils) {

    'use strict';

    var FENIX_CDN = "//fenixrepo.fao.org/cdn",
        baseUrl = '../../src/js/';

    // replace placeholders and baseUrl
    paths = Utils.replacePlaceholders(paths, FENIX_CDN);
    paths.baseUrl = baseUrl;

    requirejs.config(paths);

    requirejs(['fx-m-c/start', 'jquery', 'amplify'], function (MapCreator, $) {

        var mapCreator = new MapCreator();

        mapCreator.render({
            container: '.content'
        });

        // TODO: add map to existing map

        // TODO: add JOIN from catalog to the map
        amplify.subscribe('fx.component.map.ready', function () {

/*            $.get('http://fenix.fao.org/d3s/msd/resources/uid/FAOSTAT_fertilizer_test?full=true&dsd=true', function (model) {

                mapCreator.addLayer(model, { colorramp: 'Greens' });
                mapCreator.addCountryBoundaries();
            });*/


            $.get('dataset/bangkok.json', function (model) {

                mapCreator.addLayer(model, { colorramp: 'Greens' });
                mapCreator.addCountryBoundaries();
            });

        });

    });

});
