/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'introjs',
    'underscore',
    'amplify'
], function ($,
             log,
             introJs,
             _
) {

    'use strict';

    var s = {
    },

    defaultOptions = {
        storageKey: 'onboarding_',
        interval: 1000,
        intervalForce: 350,
        failures: 0,
        maxFailures: 4
    };

    function OnBoarding() {
        this.intro = new introJs();
        return this;
    }

    OnBoarding.prototype.setOptions = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        if (this.o.id === undefined) {
            log.error("OnBoarding.setOptions; id is undefined");
        }

        this.o.storageKey = this.o.storageKey + this.o.id;

    };

    OnBoarding.prototype.start = function (force) {

        var self = this,
            force = force || false;

        this.intro.oncomplete(function () {
            self._onComplete();
        });

        this.intro.onexit(function () {
            self._onExit();
        });

        // TODO: check if it is skipped and not exit

        if (this.o == undefined) {
            log.error("OnBoarding.start; options are empty");
        }

        // filter visible steps
        var checkElements = setInterval(function () {

            var steps = self._filterVisibleSteps();
            if (steps.length === self.o.steps.length) {

                log.info("OnBoarding.start; starting", steps.length === self.o.steps.length);

                // putting the filters steps as steps to use
                self.o.steps = steps;

                // setting the options
                self.intro.setOptions(self.o);

                self._startReady(force);
                clearInterval(checkElements);
            } else {

                if (self.o.failures++ >= self.o.maxFailures) {
                    // exit
                    log.error("OnBoarding.start; reached max failures", self.o.maxFailures);
                    clearInterval(checkElements);
                }
                log.warn("OnBoarding.start; failures", self.o.failures)
            }

        }, force === true ? this.o.intervalForce : this.o.interval);


    };

    OnBoarding.prototype._startReady = function (force) {

        if (this.isSeen() === undefined || force === true) {
            if (!this._isAlreadyOnTour()) {
                this.intro.start();
            } else {
                log.error("OnBoarding._startReady; Another onboarding is already visible.");
            }

        }

    };

    /* TODO: check if it is skipped and not exit */
    OnBoarding.prototype._onSkip = function () {
        amplify.store(this.o.storageKey, "skip");
    };

    OnBoarding.prototype._isAlreadyOnTour = function () {
        return $(".introjs-overlay").is(":visible");
    };

    /*  the user exit the tour, but didn't skip it */
    OnBoarding.prototype._onExit = function () {
        // TODO: in theory on exit should not be saved the onboarding
        amplify.store(this.o.storageKey, "exit");
        log.info("OnBoarding.onExit; has been saved", this.isSeen()? true: false)
    };

    /* the user completed the tour, so should not be annoyed anymore */
    OnBoarding.prototype._onComplete = function () {
        amplify.store(this.o.storageKey, "complete");
        log.info("OnBoarding.onExit; has been saved", this.isSeen()? true: false)
    };

    /* check if the used seen the tour */
    OnBoarding.prototype.isSeen = function () {
        return amplify.store(this.o.storageKey);
    };

    OnBoarding.prototype._filterVisibleSteps = function () {

        var r = [],
            steps = this.o.steps;

        for(var i=0; i < steps.length; i++) {

            var element = this._getElement(steps[i]);

            if ( element !== undefined && element.is(':visible')) {
                r.push($.extend(true, {}, steps[i], {element: element[0]}));
            }
        }

        return r;
    };

    OnBoarding.prototype._getElement = function (step) {
        var element = step.element,
            target = step.target;

        if (target !== undefined) {
            return target.find(element);
        }

        return $(element);

    };

    OnBoarding.prototype.destroy = function () {

        if (this.intro !== undefined) {
            this.intro.exit();
        }

    };

    return OnBoarding;
});
