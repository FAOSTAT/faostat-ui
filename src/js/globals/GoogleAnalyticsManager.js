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

        // GA trackers. This will handle multiple GOOGLE ANALYTICS instances
        //https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers#working_with_multiple_trackers
        _.each(C.GOOGLE_ANALYTICS, function(analytics) {
            ga('create', analytics.ID, "auto", analytics.NAME);
        });
        // ga('create', C.GOOGLE_ANALYTICS_ID, "auto");

        return this;
    }

    GoogleAnalyticsManager.prototype.event = function (data) {

        log.info("GoogleAnalyticsManager; event", data, this);

        // set the current pageView (it could be different i.e. using different browser tabs)
        this.checkAndSetCurrentPage();
        
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
            //ga('send', event);
            _.each(ga.getAll(), function(tracker) {
                tracker.send(event);
            });

        }
        else {
            log.warn('GoogleAnalyticsManager.event; Event has not been saved:', data);
        }
    };

    GoogleAnalyticsManager.prototype.checkAndSetCurrentPage = function () {

        // Google analytics says that it's required a pageView before and Event
        log.info("GoogleAnalyticsManager; setCurrentPage", Backbone.history.getFragment());

        // this is set to avoid double counting on the same page
        var countPageView = this.CURRENT_PAGE !== Backbone.history.getFragment();

        this.CURRENT_PAGE = Backbone.history.getFragment();

        /*ga('set', {
            page: this.CURRENT_PAGE,
            title: this.CURRENT_PAGE
        });
        */

        var self = this;
        _.each(ga.getAll(), function(tracker) {
            tracker.set({
                page: self.CURRENT_PAGE,
                title: self.CURRENT_PAGE
            });
        });

        return countPageView;

    };

   GoogleAnalyticsManager.prototype.pageView = function () {

       if (this.checkAndSetCurrentPage()) {
          // ga('send', 'pageview');
           _.each(ga.getAll(), function(tracker) {
               tracker.send('pageview');
           });
       }

    };

    GoogleAnalyticsManager.prototype.timing = function (data) {

        // set the current pageView (it could be different i.e. using different browser tabs)
        this.pageView();

        var category = 'test',
            action = 'test',
            value = 100; // in milliseconds

        // ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
        /*ga('send', {
            hitType: 'timing',
            timingCategory: category,
            timingVar: action,
            timingValue: value
        });*/

        _.each(ga.getAll(), function(tracker) {
            tracker.send({
                hitType: 'timing',
                timingCategory: category,
                timingVar: action,
                timingValue: value
            });
        });

    };

    return new GoogleAnalyticsManager();

});
