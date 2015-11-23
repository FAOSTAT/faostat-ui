/*global define*/
define(['jquery',
        'handlebars',
        'faostat_commons',
        'FAOSTAT_THEME',
        'fx-report',
        'text!fenix_ui_metadata_viewer/html/templates.hbs',
        'i18n!fenix_ui_metadata_viewer/nls/translate',
        'text!fenix_ui_metadata_viewer/config/application_settings.json',
        'sweetAlert',
        'jsonEditor'
        ], function ($, Handlebars, FAOSTATCommons, FAOSTAT_THEME, FENIX_UI_REPORTS,
                     templates, translate, application_settings, sweetAlert) {

    'use strict';

    function FUIMDV() {

        this.CONFIG = {

            lang: 'en',
            edit: false,
            domain: 'GT',
            schema: null,
            data: null,
            lang_faostat: 'E',
            application_name: 'faostat',
            placeholder_id: 'placeholder',
            url_mdsd: 'http://faostat3.fao.org/d3s2/v2/mdsd',
            url_pdf_service: 'http://fenixapps2.fao.org/fenixExport',
            url_wds_table: 'http://fenixapps2.fao.org/wds_5.1/rest/table/json',
            url_d3s: 'http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid',
            rendered: false,

            /* Events to destroy. */
            callback: {
                onMetadataRendered: null
            }

        };

    }

    FUIMDV.prototype.isRendered = function () {
        return this.CONFIG.rendered;
    };

    FUIMDV.prototype.isNotRendered = function () {
        return !this.CONFIG.rendered;
    };

    /**
     * This is the entry method to configure the module.
     *
     * @param config Custom configuration in JSON format to extend the default settings.
     */
    FUIMDV.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'en';

        /* Cast application settings. */
        if (typeof application_settings == 'string')
            application_settings = $.parseJSON(application_settings);

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Apply FAOSTAT theme for json-editor. */
        JSONEditor.defaults.themes.faostat_theme = JSONEditor.AbstractTheme.extend(FAOSTAT_THEME);

        /* Extend string editor. */
        JSONEditor.defaults.editors.string = JSONEditor.defaults.editors.string.extend(this.custom_string_editor);

        /* This... */
        var _this = this;

        /* Clear previous editor, if any. */
        if (_this.CONFIG.hasOwnProperty('placeholder')) {
            _this.CONFIG.container =  $(_this.CONFIG.placeholder);
        } else {
            _this.CONFIG.container =   $('#' + _this.CONFIG.placeholder_id);
        }

        _this.CONFIG.container.empty();

        /* Load the schema from DB, if needed. */
        this.CONFIG.schema == null ? this.load_schema_from_db() : this.create_editor();

    };

    FUIMDV.prototype.load_schema_from_db = function() {

        /* This... */
        var _this = this;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_mdsd,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                _this.CONFIG.schema = response;
                if (typeof _this.CONFIG.schema == 'string')
                    _this.CONFIG.schema = $.parseJSON(response);

                /* Initiate JSON editor. */
                console.debug(JSON.stringify(_this.CONFIG.schema));
                _this.create_editor();

            },

            error: function (a) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    FUIMDV.prototype.remove_OjCodeLists = function (schema_property) {
        var i, p;
        /* Remove codelists. */
        if (schema_property.$ref !== undefined && schema_property.$ref === '#/definitions/OjCodeList') {
            schema_property.type = 'string';
            delete schema_property.$ref;
        }
        /* Add better header for array children. */
        if (schema_property.items !== undefined) {
            schema_property.items.headerTemplate ='{{i1}}';
        }
        /* Remove maps. */
        if (schema_property.patternProperties !== undefined) {
            schema_property.type = 'string';
            delete schema_property.patternProperties;
        }
        if (schema_property.properties !== undefined) {
            for (i = 0; i < Object.keys(schema_property.properties).length; i += 1) {
                p = schema_property.properties[Object.keys(schema_property.properties)[i]];
                this.remove_OjCodeLists(p);
            }
        }
    };

    FUIMDV.prototype.create_editor = function() {

        /* Refactor schema. */
        this.CONFIG.schema = this.refactor_schema(this.CONFIG.schema);

        /* Simplify OjCodeLists objects. */
        this.remove_OjCodeLists(this.CONFIG.schema);

        /* Initiate JSON editor. */
        var editor = new JSONEditor( this.CONFIG.container[0], {
            schema: this.CONFIG.schema,
            theme: 'faostat_theme',
            iconlib: 'fontawesome4',
            disable_edit_json: true,
            disable_properties: true,
            collapsed: true,
            disable_array_add: true,
            disable_array_delete: true,
            disable_array_reorder: true,
            disable_collapse: false,
            remove_empty_properties: false,
            expand_height: true
        });

        /* Remove unwanted labels. */
        this.CONFIG.container.find('div:first').find('h3:first').empty();
        this.CONFIG.container.find('div:first').find('p:first').empty();

        /* Add Export to PDF button. */
        var source = $(templates).filter('#export_pdf_button_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            export_pdf_label: translate.export_pdf_label
        };
        var html = template(dynamic_data);
        $(this.CONFIG.container[0]).prepend(html);

        /* Bind listener. */
        this.export_pdf();

        /* Load data, if needed. */
        this.CONFIG.data !== null ? this.populate_editor(editor) : this.load_data(editor);

    };

    FUIMDV.prototype.export_pdf = function() {
        $('#export_pdf_button').click({url_pdf_service: this.CONFIG.url_pdf_service,
                                       uid: this.CONFIG.domain,
                                       lang: this.CONFIG.lang,
                                       filename: 'FAOSTAT_metadata_' + this.CONFIG.domain + '_' + this.CONFIG.lang + '.pdf'}, function(e) {
            var url = e.data.url_pdf_service;
            var payload = {
                input: {
                    config: {
                        uid: e.data.uid
                    }
                },
                output: {
                    config: {
                        lang: e.data.lang.toUpperCase(),
                        fileName: e.data.filename
                    }
                }
            };
            var fenix_export = new FENIX_UI_REPORTS();
            fenix_export.init('metadataExport');
            fenix_export.exportData(payload, url);
        });
    };

    FUIMDV.prototype.refactor_schema = function(json) {
        json['properties']['meIdentification'] = {};
        json['properties']['meIdentification']['propertyOrder'] = 1;
        json['properties']['meIdentification']['type'] = 'object';
        json['properties']['meIdentification']['title'] = translate.identification;
        json['properties']['meIdentification']['properties'] = {};
        var section_regex = /[me]{2}[A-Z]/;
        var properties = json.properties;
        for (var key in properties) {
            if (!section_regex.test(key)) {
                if (key == 'title') {
                    json['properties']['meIdentification']['properties']['title_fenix'] = json['properties'][key];
                } else {
                    json['properties']['meIdentification']['properties'][key] = json['properties'][key];
                }
                delete json['properties'][key];
            }
        }
        return json;
    };

    FUIMDV.prototype.apply_settings = function(data) {

        /* Apply application settings. */
        var settings = application_settings[this.CONFIG.application_name];

        /* Filter by blacklist... */
        if (settings['blacklist'] != null && settings['blacklist'].length > 0) {
            settings['blacklist'].forEach(function(setting) {
                try {
                    delete data[setting.toString()]
                } catch (e) {

                }
            });
        }

        /* ...or by whitelist. */
        else {
            for (var key in data) {
                if ($.inArray(key, settings['whitelist']) < 0) {
                    try {
                        delete data[key.toString()]
                    } catch (e) {

                    }
                }
            }
        }

        return data;
    };

    FUIMDV.prototype.load_data = function(editor) {

        /* This... */
        var _this = this;

        /* ID to be used for D3S. */
        var d3s_id = this.CONFIG.domain != null ? this.CONFIG.domain : this.CONFIG.group;

        /* Load JSON schema. */
        $.ajax({

            url: this.CONFIG.url_d3s + '/' + d3s_id.toUpperCase() + '?full=true',
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                _this.CONFIG.data = response;
                if (typeof _this.CONFIG.data == 'string')
                    _this.CONFIG.data = $.parseJSON(response);

                /* Populate editor. */
                _this.populate_editor(editor);

            },

            error: function (a, b, c) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    FUIMDV.prototype.remove_OjCodeListsData = function (schema_property, key, father) {
        var i, p;
        if (schema_property.EN !== undefined) {
            father[key] = schema_property.EN;
        }
        if (schema_property.codes !== undefined && schema_property.codes[0] !== undefined) {
            if (schema_property.codes[0].label) {
                p = schema_property.codes[0].label.EN;
            } else {
                p = schema_property.codes[0].code;
            }
            father[key] = p;
        } else {
            for (i = 0; i < Object.keys(schema_property).length; i += 1) {
                if (typeof schema_property[Object.keys(schema_property)[i]] === 'object') {
                    this.remove_OjCodeListsData(schema_property[Object.keys(schema_property)[i]], Object.keys(schema_property)[i], schema_property);
                }
            }
        }
    };

    FUIMDV.prototype.populate_editor = function(editor) {

        /* Apply application settings. */
        this.CONFIG.data = this.apply_settings(this.CONFIG.data);

        /* Simplify OjCodeLists data. */
        var i;
        for (i = 0; i < Object.keys(this.CONFIG.data).length; i += 1) {
            if (typeof this.CONFIG.data[Object.keys(this.CONFIG.data)[i]] === 'object') {
                this.remove_OjCodeListsData(this.CONFIG.data[Object.keys(this.CONFIG.data)[i]], Object.keys(this.CONFIG.data)[i], this.CONFIG.data);
            }
        }

        /* Display the editor... */
        if (this.CONFIG.data != undefined) {

            /* Regular expression test to reorganize metadata sections. */
            this.CONFIG.data['meIdentification'] = {};
            var section_regex = /[me]{2}[A-Z]/;
            var properties = this.CONFIG.data;
            for (var key in properties) {
                if (!section_regex.test(key)) {
                    if (key == 'title') {
                        this.CONFIG.data['meIdentification']['title_fenix'] = this.CONFIG.data[key];
                    } else {
                        this.CONFIG.data['meIdentification'][key] = this.CONFIG.data[key];
                    }
                    delete this.CONFIG.data[key];
                }
            }

            /* Populate the editor. */
            if (this.CONFIG.data != null)
                editor.setValue(this.CONFIG.data);

            /* Disable editing. */
            if (!this.CONFIG.edit)
                editor.disable();

            /* Collapse editor. */
            this.CONFIG.container.find('.btn.btn-default.json-editor-btn-collapse').click();

        }

        /* ...or a courtesy message. */
        else {
            this.display_courtesy_message();
        }

        /* Rendered. */
        this.CONFIG.rendered = true;

        /* Invoke user function. */
        if (this.CONFIG.callback.onMetadataRendered) {
            this.CONFIG.callback.onMetadataRendered();
        }

    };

    FUIMDV.prototype.display_courtesy_message = function() {
        var source = $(templates).filter('#courtesy_message').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            message: translate.courtesy
        };
        var html = template(dynamic_data);
        this.CONFIG.container.html(html);
    };

    FUIMDV.prototype.custom_string_editor = {

        setValue: function (value, initial, from_template) {

            var self = this;

            if (this.template && !from_template)
                return;

            if (value === null) {
                value = '';
            } else if (typeof value === "object") {
                value = JSON.stringify(value);
            } else if (typeof value !== "string") {
                value = "" + value;
            }

            /* Convert milliseconds to valid date. */
            if (this.format == 'date') {
                try {
                    var d = new Date(parseFloat(value));
                    value = d.toISOString().substring(0, 10);
                } catch (e) {

                }
            }

            if (value === this.serialized)
                return;

            /* Sanitize value before setting it */
            var sanitized = this.sanitize(value);

            if (this.input.value === sanitized)
                return;

            this.input.value = sanitized;

            /* If using SCEditor, update the WYSIWYG */
            if (this.sceditor_instance) {
                this.sceditor_instance.val(sanitized);
            } else if (this.epiceditor) {
                this.epiceditor.importFile(null, sanitized);
            } else if (this.ace_editor) {
                this.ace_editor.setValue(sanitized);
            }

            var changed = from_template || this.getValue() !== value;

            this.refreshValue();

            if (initial) {
                this.is_dirty = false;
            } else if (this.jsoneditor.options.show_errors === "change") {
                this.is_dirty = true;
            }

            if (this.adjust_height)
                this.adjust_height(this.input);

            /* Bubble this setValue to parents if the value changed */
            this.onChange(changed);

        }

    };

    return FUIMDV;

});