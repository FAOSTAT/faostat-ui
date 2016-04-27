/*global define, Backbone */
define(['loglevel', 'config/Config', 'ga'], function (log, C, ga) {

    var CURRENT_PAGE;

    function GoogleAnalyticsManager() {

        log.info("GoogleAnalyticsManager; init");

        // traking page
        ga('create', C.GOOGLE_ANALYTICS_ID, "auto");
        //ga('send', 'pageview');

        return this;
    }

    GoogleAnalyticsManager.prototype.event = function (data) {

        log.info("GoogleAnalyticsManager; event", data, this);

        // set the current pageView (it could be different i.e. using different browser tabs)
        this.pageView();

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

        if ( this.CURRENT_PAGE !== Backbone.history.getFragment()) {

            log.info("GoogleAnalyticsManager; pageView", Backbone.history.getFragment());

            this.CURRENT_PAGE = Backbone.history.getFragment();

            // TOD: get page by the fragment?

            ga('set', {
                page: this.CURRENT_PAGE,
                title: this.CURRENT_PAGE
            });
            ga('send', 'pageview');

        }else{
            log.warn("GoogleAnalyticsManager; page already set", Backbone.history.getFragment(), this.CURRENT_PAGE);
        }

    };

    GoogleAnalyticsManager.prototype.timing = function (data) {

        // set the current pageView (it could be different i.e. using different browser tabs)
        this.pageView();

        var category = 'test',
            action = 'test',
            value = 100; // in milliseconds

        // ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
        ga('send', {
            hitType: 'timing',
            timingCategory: category,
            timingVar: action,
            timingValue: value
        });

    };

    return new GoogleAnalyticsManager();

});
