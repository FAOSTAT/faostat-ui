/*global define*/
define([
        'jquery',
        'loglevel',
        'globals/Common',
        'handlebars',
        'fs-t-c/templates/base_template',
        'fs-t-c/adapters/FAOSTAT_adapter',
        /*'lib/table/templates/base_template',
        'lib/table/adapters/FAOSTAT_adapter',*/
        'i18n!nls/common',
        'underscore.string'
        //'screenfull'
    ],
    function ($, log, Common, Handlebars, Template, Adapter, i18n, _s) {

        'use strict';

        var defaultOptions = {

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
                tableClass: "fs-table",
                tableOptions: {
                    next_text: _s.capitalize(i18n.next),
                    previous_text: _s.capitalize(i18n.previous),
                    last_text: _s.capitalize(i18n.last),
                    first_text: _s.capitalize(i18n.first)
                },
                addPanel: true,
                sortable: true,

                // TODO: not used yet?
                remote: {
                    enabled: true,
                    request: {}
                }
            }

        },

        s = {
            FULLSCREEN: '[data-role="fullscreen"]'
        };

        function Table() {

            return this;
        }

        Table.prototype.render = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.template = new Template();
            this.adapter = new Adapter();

            // prepare data
            this.o.filteredModel = this.adapter.prepareData(this.o);

            // format value data
            this.o.model.data = this.adapter.formatData();

            // add language
            this.o.lang = this.addLocale();

            // render table
            this.template.render(this.o);

            // bind events
            this.bindEventListeners();

        };

        Table.prototype.getContainer = function () {
            return this.o.container;
        };

        Table.prototype.formatData = function (model) {

           log.info('Table.formatData;', model);

           this.o.model = model || this.o.model;
           this.o.model.data = this.adapter.formatData(this.o.model);

           return this.o.model.data;
        };

        Table.prototype.refresh = function () {

        };

        Table.prototype.addLocale = function() {

            // adding French
            $.fn.bootstrapTable.locales['fr-FR'] = {
                formatLoadingMessage: function () {
                    return 'Chargement en cours, patientez, s´il vous plaît ...';
                },
                formatRecordsPerPage: function (pageNumber) {
                    return pageNumber + ' lignes par page';
                },
                formatShowingRows: function (pageFrom, pageTo, totalRows) {
                    return 'Affichage des lignes ' + pageFrom + ' à ' + pageTo + ' sur ' + totalRows + ' lignes au total';
                },
                formatSearch: function () {
                    return 'Rechercher';
                },
                formatNoMatches: function () {
                    return 'Aucun résultat trouvé';
                },
                formatRefresh: function () {
                    return 'Rafraîchir';
                },
                formatToggle: function () {
                    return 'Alterner';
                },
                formatColumns: function () {
                    return 'Colonnes';
                },
                formatAllRows: function () {
                    return 'Tous';
                }
            };

            // adding French
            $.fn.bootstrapTable.locales['es-SP'] = {
                formatLoadingMessage: function () {
                    return 'Cargando, por favor espera...';
                },
                formatRecordsPerPage: function (pageNumber) {
                    return pageNumber + ' registros por p&#225;gina.';
                },
                formatShowingRows: function (pageFrom, pageTo, totalRows) {
                    return pageFrom + ' - ' + pageTo + ' de ' + totalRows + ' registros.';
                },
                formatSearch: function () {
                    return 'Buscar';
                },
                formatNoMatches: function () {
                    return 'No se han encontrado registros.';
                },
                formatRefresh: function () {
                    return 'Actualizar';
                },
                formatToggle: function () {
                    return 'Alternar';
                },
                formatColumns: function () {
                    return 'Columnas';
                },
                formatAllRows: function () {
                    return 'Todo';
                }
            };

            switch(Common.getLocale()) {
                case 'es': return 'es-SP';
                case 'fr': return 'fr-FR';
                default: return null;
            }

        };

        Table.prototype.bindEventListeners = function() {

          /*  
          var self = this;
            
            this.o.container.find(s.FULLSCREEN).on('click', function() {
                if (screenfull.enabled) {
                    screenfull.request($(self.o.container)[0]);
                }
            });
            
            */
        };

        Table.prototype.destroy = function () {

            //log.warn("TODO: implement destroy");
            this.template.destroy();

        };

        return Table;
    });