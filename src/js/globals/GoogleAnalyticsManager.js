/*global define, Backbone */
define(['loglevel', 'config/Config', 'ga'], function (log, C, ga) {

    function GoogleAnalyticsManager() {

        log.info("GoogleAnalyticsManager; init");

        // traking page
        ga('create', C.GOOGLE_ANALYTICS_ID, "auto");
        //ga('send', 'pageview');

        return this;
    }

    GoogleAnalyticsManager.prototype.event = function (data) {

        log.info("GoogleAnalyticsManager; event");

        // TODO: get category dynamically (CONFIGURATION FILE?)
        //var category = ''

        // Categories
        // DOWNLOAD_STANDARD
        // VISUALIZE_BY_DOMAIN
        // SEARCH
        // VISUALIZE_BY_AREA
        // COMPARE

        // Actions
        // VISUALIZE_BY_AREA -> 'Visualize by Area'
        // DOWNLOAD_STANDARD -> 'Show Tables - TABLE'
        // DOWNLOAD_BULK	-> 'TI'

        // LABEL

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

        log.info("GoogleAnalyticsManager; pageView", Backbone.history.getFragment());

        // TOD: get page by the fragment?

        ga('set', {
            page: Backbone.history.getFragment(),
            title: Backbone.history.getFragment()
        });
        ga('send', 'pageview');

    };

    return new GoogleAnalyticsManager();

});
