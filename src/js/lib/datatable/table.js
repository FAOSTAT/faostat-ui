/*global define*/
define([
        'jquery',
        'loglevel',
        'fs-dt-c/templates/template',
        'fs-dt-c/adapters/FAOSTAT_adapter',
        'i18n!nls/common',
        'underscore.string',
    ],
    function ($, log, Template, Adapter, i18n, _s) {

        'use strict';

        var defaultOptions = {

                //container: '',
                //model: '',
                adapter: {

                    show_codes: false,
                    show_flags: true,
                    show_unit: true,
                    // decimal_places is an optional parameter. It rounds maximum 6 decimals
                    decimal_places: 6,
                    decimal_separator: '.',
                    thousand_separator: ''

                },
                template: {

                    class: "cell-border", //"table-bordered",
                    addPanel: true,
                    addExport: false,

                    table: {
                       // serverSide: true,
                        ordering: true,
                        searching: false,
                        scrollX: true,
                        //scrollY: "450px",
                        scrollCollapse: true,
                        paging: false,
                        info: false,
                        conditionalPaging: true,
                        // removed sorting on first column as default
                        aaSorting: [],
                        language: {
                            //processing:     "Traitement en cours...",
                            search:         i18n.search,
                           /* lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
                            info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                            infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                            infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                            infoPostFix:    "",
                            loadingRecords: "Chargement en cours...",
                            zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
                            emptyTable:     "Aucune donnée disponible dans le tableau",*/
                            paginate: {
                                first:      _s.capitalize(i18n.first),
                                previous:   _s.capitalize(i18n.previous),
                                next:       _s.capitalize(i18n.next),
                                last:       _s.capitalize(i18n.last)
                            },
                           /* aria: {
                                sortAscending:  ": activer pour trier la colonne par ordre croissant",
                                sortDescending: ": activer pour trier la colonne par ordre décroissant"
                            }*/
                        }
                    }
                }

            },

            s = {};

        function Table(config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            $.fn.dataTable.ext.errMode = 'none';

            return this;
        }

        Table.prototype.render = function (config) {

            this.o = $.extend(true, {}, this.o, config);

            this.template = new Template(this.o.container, this.o.template);
            this.adapter = new Adapter(this.o.adapter);

            // prepare DSD
            //this.o.model.metadata.dsd = this.adapter.prepareDSD(this.o.model);

            var model = {
                metadata: {
                    dsd: this.adapter.prepareDSD(this.o.model)
                },
                data: this.adapter.formatData(this.o.model)
            }
            this.template.render(model);


           /* $(this.o.container).DataTable( {
                serverSide: true,
                ordering: false,
                searching: false,
                pagination: true,
                "pageLength": 50,
                "lengthMenu": [ 10, 25, 50, 75, 100 ],
                ajax: function ( data, callback, settings ) {

                    log.info(data, settings);

                    var out = [];

                    for ( var i=data.start, ien=data.start+3 ; i<ien ; i++ ) {
                        out.push( [ i+'-1', i+'-2', i+'-3', i+'-4', i+'-5' ] );
                    }

                    callback( {
                        draw: data.draw,
                        data: out,
                        recordsTotal: 5000000,
                        recordsFiltered: 5000000
                    });

                }
            } );

            /*

             $(this.o.container).DataTable( {
             serverSide: true,
             ordering: false,
             searching: false,
             ajax: function ( data, callback, settings ) {
             var out = [];

             for ( var i=data.start, ien=data.start+data.length ; i<ien ; i++ ) {
             out.push( [ i+'-1', i+'-2', i+'-3', i+'-4', i+'-5' ] );
             }

             setTimeout( function () {
             callback( {
             draw: data.draw,
             data: out,
             // recordsTotal: 5000000,
             // recordsFiltered: 5000000
             } );
             }, 50 );
             },
             scrollY: 200,
             scroller: {
             // loadingIndicator: true
             }
             } );
             */

            /*var data = [];
            for (var i = 0; i < 5000; i++) {
                data.push([i, i, i, i, i]);
            }

            $(this.o.container).DataTable({
                data: data,
                deferRender: true,
                scrollY: 200,
                //scrollCollapse: true,
                //scroller:       true,
                colReorder: true,
            });*/

        };

        Table.prototype.formatData = function (model) {

        };

        Table.prototype.refresh = function () {

        };

        Table.prototype.bindEventListeners = function () {

        };

        Table.prototype.destroy = function () {

        };

        return Table;
    });