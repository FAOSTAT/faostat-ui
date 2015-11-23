/*global define*/
define([
        'jquery',
        'loglevel',
        'handlebars',
        'fs-t-c/templates/base_template',
        'fs-t-c/adapters/FAOSTAT_adapter'
    ],
    function ($, log, Handlebars, Template, Adapter) {

        'use strict';

        var defaultOptions = {

        };

        function Table() {

            return this;
        }

        Table.prototype.render = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

/*            // parse data and metadata
            var data = [{
                "name": "bootstrap-table",
                "stargazers_count": "10",
                "forks_count": "122",
                "description": "An extended Bootstrap table"
            }, {
                "name": "multiple-select",
                "stargazers_count": "288",
                "forks_count": "20",
                "description": "A jQuery plugin to select multiple elements with checkboxes :)"
            }, {
                "name": "bootstrap-table",
                "stargazers_count": "32",
                "forks_count": "11",
                "description": "Show/hide password plugin for twitter bootstrap."
            }, {
                "name": "bootstrap-table",
                "stargazers_count": "1",
                "forks_count": "4",
                "description": "my blog"
            }, {
                "name": "scutech-redmine 1",
                "stargazers_count": "50",
                "forks_count": "3",
                "description": "Redmine notification tools for chrome extension."
            }];

            var t = Handlebars.compile(template),
                data= $.extend(true, {}, {rows: data });

            $(this.o.container).append(t(data));

            log.info("here")*/

            //log.info(this.o.container);
            //$(this.o.container).bootstrapTable({
            //    data: data
            //});
            this.createTable(this.o)
        };

        Table.prototype.createTable = function(config) {

            log.info(config)

            this.template = new Template();
            //this.adapter = new Adapter();

            log.info(config)

            //currently both of them are sync fns
            this.template.render(config);

            log.info(config)

        };

        Table.prototype.getContainer = function () {
            return this.template.container;
        };

        return Table;
    });