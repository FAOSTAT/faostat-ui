/*global define, Backbone */
define(['config/Config', 'ga'], function (C, ga) {


    function GoogleAnalyticsManager() {

        console.log("INIT GoogleAnalyticsManager");

        // traking page
        ga('create', C.GOOGLE_ANALYTICS_ID, "auto");
        ga('send', 'pageview');

        return this;
    }


    /**
     *
     * @param data
     */
    GoogleAnalyticsManager.prototype.event = function (data) {

        console.log("GA event", data);

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

        if ( data.category && data.action ) {
            ga('send', {
                hitType: 'event',
                eventCategory: data.category,
                eventAction: data.action
            });
        }
        else {
            console.error('Event not saved: ', data);
        }
    };

    GoogleAnalyticsManager.prototype.pageView = function () {
        console.log("GA Page view: " + Backbone.history.getFragment());

        ga('set', {
            page: Backbone.history.getFragment(),
            title: Backbone.history.getFragment()
        });
        ga('send', 'pageview');

    };

    return new GoogleAnalyticsManager();

});
