/*global define, _:false, $, console, amplify, FM*/
define([
    'globals/Common',
    /* TODO: move to another folder? */
    'text!lib/filters/templates/filter.hbs',
    'i18n!nls/common',
    'handlebars',
    'underscore',
    'select2',
    'amplify'
], function (Common, templateFilter, i18nLabels, Handlebars, _) {

    'use strict';

    var s = {

        DD: '[data-role="dd"]'

    },defaultOptions = {

    };

    function Filter() {

        return this;
    };

    Filter.prototype.init = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        // init lang
        this.o.lang = Common.getLocale();

        // store container variable
        this.$CONTAINER = $(this.o.container);

        this.initVariables();

        this.initComponents();

        // initialize with select2
        this.$DD = this.$CONTAINER.find(s.DD);
        this.$DD.select2();
    };

    Filter.prototype.initVariables = function () {

    };

    Filter.prototype.initComponents = function () {

        this.initTemplate();

    };

    Filter.prototype.initTemplate = function () {
        var template = Handlebars.compile(templateFilter);

        var c = $.extend(true, {},{data: this.o.config.data}, this.o.componentType);

        console.log(c);


        this.$CONTAINER.append(template(c));
    };

    Filter.prototype.getDropDown = function (data) {
        return this.$DD;
    };

    Filter.prototype.getFilter = function () {
        var f = {
            id: this.o.metadata.parameters.id,
            parameter: this.o.parameter,
            codes: this.$DD.val()
        };

        // TODO: remove the alert?
        //console.log(f);
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + this.o.metadata.parameters.id
            });
        }

        // TODO: if nothing is selected set an alert?
        return f;
    };

    Filter.prototype.unbindEventListeners = function () {

    };

    Filter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return Filter;
});
