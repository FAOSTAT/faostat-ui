/*global define, amplify*/
define([
        'jquery',
        'loglevel',
        'globals/Common',
        'config/Events',
        'config/Analytics',
        'config/Routes',
        'text!lib/release-calendar/templates/templates.hbs',
        'i18n!nls/common',
        'handlebars',
        'faostatapiclient',
        'fs-dt-c/table',
        'amplify'
    ],
    function ($, log, Common, E, A, ROUTE, template, i18n, Handlebars, API) {

        'use strict';

        var defaultOptions = {},

        s = {
            CALENDAR: '[data-role="calendar"]',
            EXPORT: '[data-role="export"]'
        };

        function ReleaseCalendar() {
            return this;
        }

        ReleaseCalendar.prototype.render = function(config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            if ( this.o.container ) {
                this.$CONTAINER = $(this.o.container);

                if(this.$CONTAINER.length <= 0 ) {
                    log.error("ReleaseCalendar.render; container is not valid", this.o, this.$CONTAINER, this.$CONTAINER.length);
                }

                this._renderCalendar();
            }
            else{
                log.error("ReleaseCalendar.render; container is missing", this.o);
            }

        };

        ReleaseCalendar.prototype._renderCalendar = function() {

            var self = this;

            API.groupsanddomains().then(function(d) {

                var t = Handlebars.compile($(template).filter("#template").html()),
                    id = "table-" + Math.random().toString().replace(".", "");

                self.$CONTAINER.html(t({
                    id: id
                }));

                $.fn.dataTable.ext.errMode = 'none';

                var table = self._formatData(d);

                self.table = self.$CONTAINER.find('#' + id).DataTable( {
                    "columns": table.columns,
                    "data": table.data,
                    scrollY:        "450px",
                    //scrollY:        '50vh',
                    //scrollX:        true,
                    scrollCollapse: true,
                    paging:         false,
                    //responsive: true,
                    searching: true,
                    ordering: true,
                    info:     false,
                    colReorder: true,
                    //fixedHeader: true,
                    aaSorting: [],
                    columnDefs: [
                        //{ width: '20%', targets: 0 }
                    ],
                    language: {
                        search: "Search"
                    },
                    dom: 'Bfrtip',
                    buttons: [
                        'copy', 'excel', 'pdf'
                    ]
                });


            });

        };

        ReleaseCalendar.prototype._formatData = function(d) {

            var t = {
                columns: [
                    { "data": "group_code", visible: false }, // used for searching
                    { "data": "group_name", visible: false }, // used for searching
                    { "data": "domain_code", visible: false }, // used for searching
                    {
                        "data": "domain_name", "title": "Domain",
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            $(nTd).html("<a href='#" + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [oData.domain_code]) + "'>" + oData.domain_name + "</a>");
                        }
                    },
                    { "data": "release_next", "title": "Next Release" },
                    { "data": "state_next", "title": "Next Release Note" },
                    { "data": "release_current", "title": "Last Release / Revision" },
                    { "data": "state_current", "title": "Current Release Status" },
                    { "data": "note_update", "title": "Current Release Note" }
                ],
                data: []
            };

            var current_date = new Date();

            _.each(d.data, function(r) {

                //log.info(r);
                // validate data
                if ( r.release_next ) {
                    var release_next = new Date(r.release_next);
                    //log.info(release_next)
                    if (release_next < current_date) {
                        log.error(release_next, current_date, r)
                      //  r.release_next = "";
                    }
                }

                t.data.push(r);
            });

            return t;

        };

        ReleaseCalendar.prototype.exportCalendar = function() {

        };

        ReleaseCalendar.prototype._analyticsExport = function() {

        };

        ReleaseCalendar.prototype._bindEventListeners = function () {

        };

        ReleaseCalendar.prototype._unbindEventListeners = function () {

        };

        ReleaseCalendar.prototype.destroy = function () {

            this._unbindEventListeners();

            if(this.$CONTAINER) {
                this.$CONTAINER.empty();
            }

        };

        return ReleaseCalendar;

    });