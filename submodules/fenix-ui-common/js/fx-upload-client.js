/*global define*/
define([
    'jquery',
    'underscore',
    'handlebars',
    'text!fx-common/html/fenix-uploader-template.hbs',
    'text!fx-common/html/fenix-uploader-item.hbs',
    'q',
    'SparkMD5',
    'jquery.fileupload'
], function ($, _, Handlebars, uploadTemplate, itemTemplate, Q, SparkMD5) {

    'use strict';

    var defaultOpts = {
            upload_accept: '.csv',
            server_url: 'http://fenixservices.fao.org/upload',
            //server_url: 'http://168.202.28.32:8080/v1',
            context: "c",
            autoClose: false,
            chunkSize: 100000,
            maxRetry: 100,
            retryTimeout: 500,
            callTimeout: 500,
            debounceTimeout: 1500,
            throttleTimeout: 2000,
            pollingTimeout: 10000 //ms
        },
        s = {
            UPLOADER: '#fx-uploader',
            INPUT: '#fx-uploader-input',
            SUBMIT: '#fx-uploader-submit',
            DELETE: '#fx-uploader-delete',
            PROGRESS_BAR: '#progress .bar',
            EXTENDED_INFO: '#fx-uploader-extended-info',
            INPUT_OPENER: '#fx-uploader-input-opener',
            LIST: '#fx-uploader-list',
            ITEM_REMOVE: '.fx-uploader-item-remove',
            ITEM_LIST: '.fx-uploader-item-list',
            ITEM_STEP_ICON: 'i',
            ITEM_TICKER: '.fx-uploader-item-list-container',
            STEP_INFO: '[data-role="info"]'
        },
        step = {
            PRE_PROCESS: 'pre_process',
            UPLOAD: 'upload',
            CLOSE: 'close',
            POST_PROCESS: 'post_process',
            METADATA: 'metadata'
        },
        status = {
            WAITING: 'waiting',
            DOING: 'doing',
            DONE: 'done',
            ERROR: 'error'
        };

    /**
     * Fenix Uploader Client constructor
     * @param {Object} opts Initialization options
     * @return {Object} Fenix Uploader instance
     */
    function FxUploader(opts) {

        this.o = $.extend(true, {}, defaultOpts, opts);

        this.current = {};

        return this;
    }

    /**
     * Compile and inject the Fenix Upload Client HTML template
     * @return {JQuery} Fenix Upload Client container
     */
    FxUploader.prototype._injectTemplate = function () {

        var template = Handlebars.compile(uploadTemplate),
            result = template(this.o);

        return this.$el.html(result);
    };

    /**
     * Cache jQuery selectors
     * @return {undefined}
     */
    FxUploader.prototype._initVariables = function () {

        this.$inputOpener = this.$el.find(s.INPUT_OPENER);

        this.$input = this.$el.find(s.INPUT);

        this.$submit = this.$el.find(s.SUBMIT);

        this.$delete = this.$el.find(s.DELETE);

        this.$uploader = this.$el.find(s.UPLOADER);

        this.$list = this.$el.find(s.LIST);
    };

    /**
     * Init internal components
     * @return {undefined}
     */
    FxUploader.prototype._initUploader = function (item) {

        var self = this;

        item.jqXHR = item.template.fileupload({

            url: this.o.server_url + '/file/chunk/' + this.o.context + '/' + item.details.md5,

            maxChunkSize: this.o.chunkSize,

            multipart: false,

            singleFileUploads: true,

            sequentialUploads: true,

            done: _.bind(this._onTransferComplete, this, item),

            //progressall: _.bind(this._onProgressAll, this, item),

            progress: _.bind(this._onUploadProgress, this, item),

            add: function (e, data) {

                if (item.metadata) {
                    data.uploadedBytes = item.metadata.status.currentSize;
                }

                $.blueimp.fileupload.prototype.options.add.call(this, e, data);
            },

            fail: function () {
                self._setStepStatus(status.ERROR, item);
            }
        });

    };

    /**
     * Render the Fenix Upload Client
     * @param {Object} opts Initialization options
     * @return {Object} Fenix Uploader instance
     */
    FxUploader.prototype.render = function (opts) {

        $.extend(true, this.o, opts);

        this._validate();

        this.$el = $(this.o.container);

        this._injectTemplate();

        this._initVariables();

        this._bindEventListeners();

        return this;

    };

    /**
     * Input validation function.
     * TODO to be implemented
     * @return {Object} errors
     */
    FxUploader.prototype._validate = function () {

        var errors;

        return errors;

    };

    /**
     * Contains the sequence of operations to perform
     * to transfer a file
     * @return {undefined}
     */
    FxUploader.prototype._uploadFile = function (item) {

        var self = this;

        this._startItemStep(step.PRE_PROCESS, item);

        this._setStepStatus(status.DOING, item);

        this._setItemStatus(status.DOING, item);

        this.createFileMD5(item.file)
            .then(function (md5) {

                if (!item.details) {
                    item.details = {};
                }

                item.details.md5 = md5;

                return self._getFileMetadata(item);

            }, function () {

                self._setStepStatus(status.ERROR, item);
            })
            .then(function (metadata) {

                //console.log("Getting File Metadata: done.");

                item.metadata = metadata;

                return self._checkFileStatus(item);

            }, function () {
                self._setStepStatus(status.ERROR, item);
            });

    };

    /**
     * Get file metadata
     * @return {undefined}
     */
    FxUploader.prototype._checkFileStatus = function (item) {

        this._setStepStatus(status.DONE, item);

        var m = item.metadata,
            self = this;

        //No metadata
        if (!m) {

            this._createFileMetadata(item)
                .then(function () {
                    //console.log("File Metadata: created.");

                    self._setStepStatus(status.DONE, item);

                    return self._transferFile(item);
                }, function () {
                    self._setStepStatus(status.ERROR, item);
                });

            return;
        }

        this._startItemStep(step.METADATA, item);
        this._setStepStatus(status.DONE, item);

        //File totally uploaded, just start post-process
        if (m.status.complete === true) {

            this._startItemStep(step.UPLOAD, item);
            this._setStepStatus(status.DONE, item);
            this._startItemStep(step.CLOSE, item);
            this._setStepStatus(status.DONE, item);

            this._startPostProcess(item)
                .then(function () {
                    //console.log("Post process completed");

                    self._monitorProcessStatus(item);

                }, function () {
                    self._setStepStatus(status.ERROR, item);

                    throw new Error("Impossible to complete the postprocess");
                });

            return;
        }

        //Metadata is present, file partially uploaded
        if (m.status.currentSize) {

            this._transferFile(item);
        }
    };

    FxUploader.prototype._monitorProcessStatus = function (item) {

        var self = this;

        item.timer = window.setInterval(function () {

            self._checkProcessStatus(item)
                .then(function (flow) {

                    var error;

                    for (var i = 0; i < flow.length; i++) {
                        if (typeof  flow[i].error === 'string') {
                            error = flow[i];
                            break;
                        }
                    }

                    if (error) {

                        clearInterval(item.timer);

                        //print error
                        item.current.el.find(s.STEP_INFO).html(error);

                        self._setStepStatus(status.ERROR, item);
                        return;
                    }

                    var completed = [];

                    for (i = 0; i < flow.length; i++) {
                        if (flow[i].completed === true) {
                            completed.push(flow[i])
                        }
                    }

                    if (completed.length === flow.length) {

                        clearInterval(item.timer);

                        self._setStepStatus(status.DONE, item);

                        self._setItemStatus(status.DONE, item);

                    }

                });

        }, this.o.pollingTimeout);
    };

    /**
     * Get file metadata
     * @return {Promise}
     */
    FxUploader.prototype._checkProcessStatus = function (item) {

        return Q($.ajax({
            type: "GET",
            url: this.o.server_url + '/process/' + this.o.context + '/' + item.details.md5,
            contentType: "application/json"
        }));

    };

    /**
     * Get file metadata
     * @return {Promise}
     */
    FxUploader.prototype._getFileMetadata = function (item) {

        return Q($.ajax({
            type: "GET",
            url: this.o.server_url + '/metadata/file/' + this.o.context + '/' + item.details.md5,
            contentType: "application/json"
        }));

    };

    /**
     * Create file metadata
     * @return {Promise}
     */
    FxUploader.prototype._createFileMetadata = function (item) {

        this._startItemStep(step.METADATA, item);

        this._setStepStatus(status.DOING, item);

        return Q($.ajax({
            type: "POST",
            url: this.o.server_url + "/metadata/file",
            contentType: "application/json",
            data: JSON.stringify({
                "context": this.o.context,
                "md5": item.details.md5,
                "autoClose": this.o.autoClose
            })
        }));

    };

    /**
     * Delete file metadata
     * @return {Promise}
     */
    FxUploader.prototype._deleteFileMetadata = function (item) {

        return Q($.ajax({
            type: "DELETE",
            url: this.o.server_url + '/file/' + this.o.context + '/' + item.details.md5,
            contentType: "application/json"
        }));

    };

    /**
     * Send sequentially file's chunks and update the progress bar
     * @return {undefined}
     */
    FxUploader.prototype._transferFile = function (item) {

        this._startItemStep(step.UPLOAD, item);

        this._setStepStatus(status.DOING, item);

        this._initUploader(item);

        item.template.fileupload('add', {files: item.file});
    };

    /**
     * Handler for progress Transfer graphical extended progress information
     * @return {undefined}
     */
    FxUploader.prototype._onUploadProgress = function (item, e, data) {

        item.current.el.find(s.STEP_INFO).html(this._renderExtendedProgress(data));
    };

    /**
     * Close the transferred file
     * @return {Promise}
     */
    FxUploader.prototype._closeFile = function (item) {

        return Q($.ajax({
            type: "POST",
            url: this.o.server_url + '/file/closure/' + this.o.context + '/' + item.details.md5 + '?process=false',
            contentType: "application/json"
        }));

    };

    /**
     * Start post-process
     * @return {Promise}
     */
    FxUploader.prototype._startPostProcess = function (item) {

        this._startItemStep(step.POST_PROCESS, item);

        this._setStepStatus(status.DOING, item);

        return Q($.ajax({
            type: "POST",
            url: this.o.server_url + '/process/' + this.o.context + '/' + item.details.md5,
            contentType: "application/json"
        }));

    };

    FxUploader.prototype._renderExtendedProgress = function (data) {
        return this._formatBitrate(data.bitrate) + ' | ' +
            this._formatTime(
                (data.total - data.loaded) * 8 / data.bitrate
            ) + ' | ' +
            this._formatPercentage(
                data.loaded / data.total
            ) + ' | ' +
            this._formatFileSize(data.loaded) + ' / ' +
            this._formatFileSize(data.total);
    };

    FxUploader.prototype._formatBitrate = function (bits) {
        if (typeof bits !== 'number') {
            return '';
        }
        if (bits >= 1000000000) {
            return (bits / 1000000000).toFixed(2) + ' Gbit/s';
        }
        if (bits >= 1000000) {
            return (bits / 1000000).toFixed(2) + ' Mbit/s';
        }
        if (bits >= 1000) {
            return (bits / 1000).toFixed(2) + ' kbit/s';
        }
        return bits.toFixed(2) + ' bit/s';
    };

    FxUploader.prototype._formatTime = function (seconds) {
        var date = new Date(seconds * 1000),
            days = Math.floor(seconds / 86400);
        days = days ? days + 'd ' : '';
        return days +
            ('0' + date.getUTCHours()).slice(-2) + ':' +
            ('0' + date.getUTCMinutes()).slice(-2) + ':' +
            ('0' + date.getUTCSeconds()).slice(-2);
    };

    FxUploader.prototype._formatPercentage = function (floatValue) {
        return (floatValue * 100).toFixed(2) + ' %';
    };

    FxUploader.prototype._formatFileSize = function (bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    };

    FxUploader.prototype._getFileInfo = function (item) {

        var model = {},
            f = item.file;

        model.name = f.name;
        model.type = f.type || 'n/a';
        model.size = this._formatFileSize(f.size) || 'n/a';
        model.lastModifiedDate = f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a';

        item.model = model;

    };

    /**
     * Handler for Transfer end
     * @return {undefined}
     */
    FxUploader.prototype._onTransferComplete = function (item) {

        this._setStepStatus(status.DONE, item);

        var self = this;

        this._startItemStep(step.CLOSE, item);

        this._setStepStatus(status.DOING, item);

        this._closeFile(item).then(function () {
            //console.log("File Closed")

            self._setStepStatus(status.DONE, item);
            return self._startPostProcess(item);

        }, function () {
            self._setStepStatus(status.ERROR, item);
            throw new Error("Impossible to close the file");
        }).then(function () {

            self._monitorProcessStatus(item);

        }, function () {

            self._setStepStatus(status.ERROR, item);
            throw new Error("Impossible to complete the postprocess");
        })

    };

    /**
     * Create MD5 of
     * @param {File} [f] File whose calculate the MD5
     * @return {Promise}
     */
    FxUploader.prototype.createFileMD5 = function (f) {

        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            file = f || this.current.files[0],
            chunkSize = this.o.chunkSize,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        return Q.Promise(function (resolve, reject) {

            fileReader.onload = onLoad;

            fileReader.onerror = onError;

            fileReader.onprogress = onprogress;

            loadNext();

            function loadNext() {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
            }

            function onLoad(e) {
                //console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                spark.append(e.target.result);                   // Append array buffer
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {

                    var hash = spark.end();
                    //console.log('finished loading');
                    //console.info('computed hash', hash);  // Compute hash
                    resolve(hash);
                }
            }

            function onError() {
                reject(new Error('MD5 file: oops, something went wrong.'));
            }

            function onprogress(event) {
                //self._onProgressAll(event, {loaded: event.loaded, total: event.total})
            }
        });

    };

    /* ===================================================================== Events and handlers*/

    /**
     * Contains all the events binding
     * @return {undefined}
     */
    FxUploader.prototype._bindEventListeners = function () {

        var self = this;

        this.$inputOpener.on('click', _.throttle(function (e) {
            self._onInputOpenerClick(e);
        }, this.o.throttleTimeout));

        this.$input.on('change', _.bind(this._onInputChange, this));

    };

    /**
     * Handler invoked on opener click.
     * @return {undefined}
     */
    FxUploader.prototype._onInputOpenerClick = function (e) {

        e.preventDefault();

        this.$input.trigger('click');
    };

    /**
     * Handler invoked on file selection.
     * Reset current file information and start the MD5 calculation
     * @return {undefined}
     */
    FxUploader.prototype._onInputChange = function (e) {

        var f = e.target.files || [{name: this.value}];

        this._addItem({
            file: f[0],
            steps: []
        });

        this.$input.replaceWith(this.$input = this.$input.clone(true));
    };

    FxUploader.prototype._addItem = function (item) {

        this._injectItemTemplate(item);

        this._bindItemEventListeners(item);

        this._uploadFile(item);

    };

    FxUploader.prototype._injectItemTemplate = function (item) {

        this._getFileInfo(item);

        var template = Handlebars.compile(itemTemplate),
            result = template({model: item.model});

        item.template = $(result);
        item.list = item.template.find(s.ITEM_LIST);

        return this.$list.prepend(item.template);
    };

    FxUploader.prototype._bindItemEventListeners = function (item) {

        var self = this;

        item.buttons = {};
        item.buttons.remove = item.template.find(s.ITEM_REMOVE);

        item.buttons.remove.on('click', function () {

            var r = confirm("Delete file?");
            if (r == true) {
                self._onDelete(item);
            }
        });
    };

    FxUploader.prototype._startItemStep = function (step, item) {

        //console.log('------------- start step ' + step)

        if (!item.steps) {
            item.steps = [];
        }

        var step = {
            id: step,
            el: item.list.find('[data-step=' + step + ']')
        };

        item.steps.push(step);

        item.current = step;

        /* Prepare animation */
        if (!item.animations) {
            item.animations = [];
        }

        item.animations.push({
            step: step
        });

        this._animateTicker(item);

        this._setStepStatus(status.WAITING, item);

    };

    FxUploader.prototype._animateTicker = function (item) {

        if (!item.animations || item.animations.length === 0 || item.animated === true) {
            return;
        }

        item.animated = true;

        var animation = item.animations.shift();

        this._scrollToStep(item, animation.step);

    };

    FxUploader.prototype._scrollToStep = function (item, step) {

        var self = this,
            step = _.findWhere(item.steps, {id: step.id}),
            top = item.list.find("li").index(step.el) * step.el.height(),
            string = '-' + top.toString() + 'px';

        item.list.css({'top': string});

        window.setTimeout(function () {
            item.animated = false;
            self._animateTicker(item);
        }, this.o.debounceTimeout);

    };

    FxUploader.prototype._setStepStatus = function (stat, item) {

        //console.log('set status ' + stat)

        var icon = item.current.el.find(s.ITEM_STEP_ICON);

        item.current.status = stat;

        switch (item.current.status) {
            case 'doing' :
                icon.removeClass().addClass('fa fa-refresh fa-spin step-icon');
                break;
            case 'done' :
                icon.removeClass().addClass('fa fa-check step-icon');
                break;
            case 'error' :
                icon.removeClass().addClass('fa fa-times step-icon');
                this._setItemStatus(status.ERROR, item);
                break;
            default :
                icon.removeClass().addClass('fa fa-clock');
        }

    };

    FxUploader.prototype._setItemStatus = function (stat, item) {

        var ticker = item.template.find(s.ITEM_TICKER);

        ticker.attr('data-status', status[stat.toUpperCase()]);

    };

    FxUploader.prototype._unbindItemEventListeners = function (item) {

        var btns = Object.keys(item.buttons);

        for (var i = 0; i < btns.length; i++) {

            if (btns.hasOwnProperty(btns[i])) {
                btns[i].off();
            }
        }
    };

    /**
     * Handler invoked to delete a file.
     * The file is already loaded and the MD5 hash already calculated.
     * @return {undefined}
     */
    FxUploader.prototype._onDelete = function (item) {

        var self = this;

        if (item.jqXHR && typeof item.jqXHR.abort === 'function') {
            item.jqXHR.abort();
        }

        this._deleteFileMetadata(item)
            .then(function () {

                item.template.remove();
                self._unbindItemEventListeners(item);

            }, function () {
                alert("Error on remove")
            });

    };

    /**
     * Invoked during {@link destroy} to unbind event listeners
     * @return {undefined}
     */
    FxUploader.prototype._unbindEventListeners = function () {

        this.$input.off();

        this.$submit.off();

        this.$delete.off();
    };

    /**
     * Destroy function
     * @return {undefined}
     */
    FxUploader.prototype.destroy = function () {

        this._unbindEventListeners();

        this.$uploader.fileupload('destroy');

    };

    return FxUploader;
});
