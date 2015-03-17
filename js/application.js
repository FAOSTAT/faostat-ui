define(['jquery'], function($) {

    'use strict';

    function FAOSTAT4() {

        var lang = 'E';

        this.CONFIG = {

            lang: lang,
            prefix: 'faostat_',

            download: {
                lang: lang,
                prefix: 'faostat_download_'
            }

        };

    }

    FAOSTAT4.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

        /* This... */
        var _this = this;

        /* Initiate components. */
        require(['FAOSTAT_DOWNLOAD_UI'], function(DWLD) {

            /* Initiate download. */
            var dwld = new DWLD();
            dwld.init(_this.CONFIG.download);

        });

    };

    return FAOSTAT4;

});