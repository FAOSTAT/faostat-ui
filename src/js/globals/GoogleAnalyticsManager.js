/*global define, Backbone */
define(['loglevel', 'config/Config', 'ga'], function (log, C, ga) {

    function GoogleAnalyticsManager() {

        //log.info("INIT GoogleAnalyticsManager");

        // traking page
        ga('create', C.GOOGLE_ANALYTICS_ID, "auto");
        //ga('send', 'pageview');

        return this;
    }


    /**
     *
     * @param data
     */
    GoogleAnalyticsManager.prototype.event = function (data) {

        //log.info("GA Event", data);

        // TODO: get category dinamically (CONFIGURATION FILE?)
        //var category = ''

        // CATEGORIES
        // DOWNLOAD_STANDARD
        // VISUALIZE_BY_DOMAIN
        // SEARCH
        // VISUALIZE_BY_AREA
        // COMPARE

        // AZIONE
        // VISUALIZE_BY_AREA -> 'Visualize by Area'
        // DOWNLOAD_STANDARD -> 'Show Tables - TABLE'
        // DOWNLOAD_BULK	-> 'TI'

        // LABEL
        // non e' usata

        if (data.category && data.action) {
            ga('send', {
                hitType: 'event',
                eventCategory: data.category,
                eventAction: data.action
            });
        }
        else {
            //log.error('Event not saved: ', data);
        }
    };

    GoogleAnalyticsManager.prototype.pageView = function () {

        //log.info("GA Page view: " + Backbone.history.getFragment());

        ga('set', {
            page: Backbone.history.getFragment(),
            title: Backbone.history.getFragment()
        });
        ga('send', 'pageview');

    };

    return new GoogleAnalyticsManager();

});
