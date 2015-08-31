define(['sweetAlert'], function(swal) {

    'use strict';

    function FENIX_THEME() {

        this.CONFIG = {

            /* Override this to edit group's descriptions. */
            getHeader: function(text) {
                var el = document.createElement('h3');
                if(typeof text === 'string') {
                    el.textContent = text;
                } else {
                    el.appendChild(text);
                }
                return el;
            },

            /* Override this to edit group's descriptions. */
            getDescription: function(text) {
                var el = document.createElement('p');
                //el.innerHTML = text;
                el.innerHTML = '';
                return el;
            },

            getSelectInput: function (options) {
                var el = this._super(options);
                el.className += 'form-control';
                return el;
            },

            setGridColumnSize: function (el, size) {
                el.className = 'col-md-' + size;
            },

            afterInputReady: function (input) {
                if (input.controlgroup) return;
                input.controlgroup = this.closest(input, '.form-group');
                if (this.closest(input, '.compact')) {
                    input.controlgroup.style.marginBottom = 0;
                }
            },

            getTextareaInput: function () {
                var el = document.createElement('textarea');
                el.className = 'form-control';
                return el;
            },

            getRangeInput: function (min, max, step) {
                return this._super(min, max, step);
            },

            getFormInputField: function (type) {
                var el = this._super(type);
                if (type !== 'checkbox') {
                    el.className += 'form-control';
                }
                return el;
            },

            getFormControl: function (label, input, description) {

                if (label.innerHTML == 'Resource identification code') {
                    //console.log(label.innerHTML);
                    //console.log(input);
                    //console.log(description.innerHTML);
                }

                var group = document.createElement('div');

                if (label && input.type === 'checkbox') {
                    group.className += ' checkbox';
                    label.appendChild(input);
                    label.style.fontSize = '14px';
                    group.style.marginTop = '0';
                    group.appendChild(label);

                    /* Custom implementation for the description field. */
                    if (description)
                        group.appendChild(this.createDescription(description));

                    input.style.position = 'relative';
                    input.style.cssFloat = 'left';
                }

                else {

                    group.className += ' form-group';

                    if (label) {
                        label.className += ' control-label';
                        group.appendChild(label);
                    }

                    /* Custom implementation for the description field. */
                    if (description)
                        group.appendChild(this.createDescription(description));

                    group.appendChild(input);

                }

                return group;

            },

            createDescription: function(description) {
                var icon = document.createElement('i');
                icon.className = 'fa fa-info-circle';
                icon.style.float = 'right';
                icon.onclick = function() {
                    swal({
                        title: '',
                        type: 'info',
                        text: description.innerHTML,
                        html: true
                    });
                };
                return icon;
            },

            getIndentedPanel: function () {
                var el = document.createElement('div');
                el.className = 'well well-sm';
                return el;
            },

            getFormInputDescription: function (text) {
                var el = document.createElement('p');
                el.className = 'help-block';
                el.textContent = text;
                return el;
            },

            getHeaderButtonHolder: function () {
                var el = this.getButtonHolder();
                el.style.marginLeft = '10px';
                return el;
            },

            getButtonHolder: function () {
                var el = document.createElement('div');
                el.className = 'btn-group';
                el.style.float = 'right';
                return el;
            },

            getButton: function (text, icon, title) {
                var el = this._super(text, icon, title);
                el.className += 'btn btn-default';
                return el;
            },

            getTable: function () {
                var el = document.createElement('table');
                el.className = 'table table-bordered';
                el.style.width = 'auto';
                el.style.maxWidth = 'none';
                return el;
            },

            addInputError: function (input, text) {
                if (!input.controlgroup) return;
                input.controlgroup.className += ' has-error';
                if (!input.errmsg) {
                    input.errmsg = document.createElement('p');
                    input.errmsg.className = 'help-block errormsg';
                    input.controlgroup.appendChild(input.errmsg);
                } else {
                    input.errmsg.style.display = '';
                }
                input.errmsg.textContent = text;
            },

            removeInputError: function (input) {
                if (!input.errmsg) return;
                input.errmsg.style.display = 'none';
                input.controlgroup.className = input.controlgroup.className.replace(/\s?has-error/g, '');
            },

            getTabHolder: function () {
                var el = document.createElement('div');
                el.innerHTML = "<div class='tabs list-group col-md-2'></div><div class='col-md-10'></div>";
                el.className = 'rows';
                return el;
            },

            getTab: function (text) {
                var el = document.createElement('a');
                el.className = 'list-group-item';
                el.setAttribute('href', '#');
                el.appendChild(text);
                return el;
            },

            markTabActive: function (tab) {
                tab.className += ' active';
            },

            markTabInactive: function (tab) {
                tab.className = tab.className.replace(/\s?active/g, '');
            },

            getProgressBar: function () {
                var min = 0, max = 100, start = 0;
                var container = document.createElement('div');
                container.className = 'progress';
                var bar = document.createElement('div');
                bar.className = 'progress-bar';
                bar.setAttribute('role', 'progressbar');
                bar.setAttribute('aria-valuenow', start);
                bar.setAttribute('aria-valuemin', min);
                bar.setAttribute('aria-valuenax', max);
                bar.innerHTML = start + "%";
                container.appendChild(bar);
                return container;
            },

            updateProgressBar: function (progressBar, progress) {
                if (!progressBar) return;

                var bar = progressBar.firstChild;
                var percentage = progress + "%";
                bar.setAttribute('aria-valuenow', progress);
                bar.style.width = percentage;
                bar.innerHTML = percentage;
            },

            updateProgressBarUnknown: function (progressBar) {
                if (!progressBar) return;

                var bar = progressBar.firstChild;
                progressBar.className = 'progress progress-striped active';
                bar.removeAttribute('aria-valuenow');
                bar.style.width = '100%';
                bar.innerHTML = '';
            }

        };

    }

    return new FENIX_THEME().CONFIG;

});