/*global define*/
define(function () {
    "use strict";

    var Utils = function () {

        function replacePlaceholders(paths, FENIX_CDN) {
            for (var i in Object.keys(paths.paths)) {
                if (paths.paths.hasOwnProperty(Object.keys(paths.paths)[i])) {
                    paths.paths[Object.keys(paths.paths)[i]] = paths.paths[Object.keys(paths.paths)[i]].replace('{FENIX_CDN}', FENIX_CDN);
                }
            }
            return paths;
        }

        return {
            replacePlaceholders: replacePlaceholders
        };
    };
    return Utils();
});
