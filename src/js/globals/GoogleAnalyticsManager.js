/*global define, Backbone */
define([
    'loglevel',
    'globals/Common',
    'config/Config',
    'underscore',
    'ga'
], function (
    log,
    Common,
    C,
    _,
    ga) {

    var CURRENT_PAGE;

    function GoogleAnalyticsManager() {

        // traking page
        ga('create', C.GOOGLE_ANALYTICS_ID, "auto");
        //ga('send', 'pageview');

        return this;
    }

    GoogleAnalyticsManager.prototype.event = function (data) {

        log.info("GoogleAnalyticsManager; event", data, this);

        // set the current pageView (it could be different i.e. using different browser tabs)
        this.pageView();
        
        // add section to object
        data.label = data.label || "";

        // if is an Object has to be stringified
        data.label = !_.isObject(data.label)? data.label: JSON.stringify(data.label);
        data.action = !_.isObject(data.action)? data.action: JSON.stringify(data.action);

        // event
        var event =  {
            hitType: 'event',
            eventCategory: data.category,
            eventAction: data.action,
            eventLabel: data.label
        };

        // adding value if exists
        if (data.hasOwnProperty("value")) {
            event.eventValue = data.value;
        }
        
        if (data.category !== undefined && data.action !== undefined) {
            ga('send', event);
        }
        else {
            log.warn('GoogleAnalyticsManager.event; Event has not been saved:', data);
        }
    };

    GoogleAnalyticsManager.prototype.pageView = function () {

       /* if ( this.CURRENT_PAGE !== Backbone.history.getFragment()) {

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
        }*/

        // Google analytics says that it's required a pageView before and Event
        log.info("GoogleAnalyticsManager; pageView", Backbone.history.getFragment());

        this.CURRENT_PAGE = Backbone.history.getFragment();

        // TOD: get page by the fragment?

        ga('set', {
            page: this.CURRENT_PAGE,
            title: this.CURRENT_PAGE
        });
        ga('send', 'pageview');

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
