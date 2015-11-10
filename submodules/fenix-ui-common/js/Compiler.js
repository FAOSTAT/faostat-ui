/*global define*/
define(function () {

    var placeholders = {
        "FENIX_CDN": "//fenixapps.fao.org",
        "HOST": "//fenix.fao.org"
    };

    function _resolve(obj, opts) {

        if (typeof opts !== 'undefined'){
            if (opts.hasOwnProperty('placeholders')){
                placeholders = _deepExtend(placeholders, opts.placeholders);
            }
        }

        if (Array.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                _configure(obj[i]);
            }
        } else {
            _configure(obj);
        }

        if (typeof opts !== 'undefined'){

            if (opts.hasOwnProperty('config')){
                _preConfigure(opts.config);
            }
        }
    }

    function _preConfigure(conf) {

        if (conf.hasOwnProperty('paths') ) {
            conf.paths = _compilePaths(conf.paths);
        }

        requirejs.config(conf);
    }

    function _configure(obj) {

        var config = {};

        if (typeof obj.placeholder !== 'undefined') {
            placeholders = _deepExtend(obj.placeholder, p);
        }

        if (!obj.override) {
            obj.override = {};
        }

        if (obj.baseUrl && obj.baseUrl[obj.baseUrl.length - 1] != '/') {
            obj.baseUrl = obj.baseUrl + '/';
        }

        //Paths compilation
        if (typeof obj.paths === 'string') {
            obj.paths = _compileURL(obj.paths);
        } else {
            obj.paths = _compilePaths(obj.paths);
        }

        for (var path in obj.paths) {
            // Don't add baseUrl to anything that looks like a full URL like 'http://...' or anything that begins with a forward slash
            if (!obj.paths[path].match(/^(?:.*:\/\/|\/)/)) {
                obj.paths[path] = obj.baseUrl + obj.paths[path];
            }
        }

        for (var pathName in obj.override) {
            if (obj.override.hasOwnProperty(pathName)) {
                obj.paths[pathName] = _compileURL(obj.override[pathName]);
            }
        }

        //Config compilation
        config.paths = obj.paths;
        config.shim = obj.shim;

        requirejs.config(config);

        //Extend RequireJS Config
        return config;

    }

    function _compilePaths(paths) {

        var p,
            compiled;

        //Stringify paths
        p = JSON.stringify(paths);

        try {
            compiled = JSON.parse(_compileURL(p));
        } catch (e) {
            throw new Error('Impossible to compile FENIX paths!');
        }

        return compiled;
    }

    function _compileURL(url) {

        var compiled = url;

        if (typeof compiled !== 'string') {
            throw new Error('Impossible to compile URL :"' + compiled + '". URL must be a string');
        }

        if (compiled.length < 1) {
            throw new Error("Impossible to compile URL." + compiled);
        }

        return _template(compiled, placeholders);
    }

    function _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    }

    //For more info https://github.com/unclechu/node-deep-extend
    function _deepExtend(/*obj_1, [obj_2], [obj_N]*/) {
        if (arguments.length < 1 || typeof arguments[0] !== 'object') {
            return false;
        }

        if (arguments.length < 2) return arguments[0];

        var target = arguments[0];

        // convert arguments to array and cut off target object
        var args = Array.prototype.slice.call(arguments, 1);

        var key, val, src, clone, tmpBuf;

        args.forEach(function (obj) {
            if (typeof obj !== 'object') return;

            for (key in obj) {
                if (!(key in obj)) continue;

                src = target[key];
                val = obj[key];

                if (val === target) continue;

                if (typeof val !== 'object' || val === null) {
                    target[key] = val;
                    continue;
                } else if (val instanceof Buffer) {
                    tmpBuf = new Buffer(val.length);
                    val.copy(tmpBuf);
                    target[key] = tmpBuf;
                    continue;
                } else if (val instanceof Date) {
                    target[key] = new Date(val.getTime());
                    continue;
                } else if (val instanceof RegExp) {
                    target[key] = new RegExp(val);
                    continue;
                }

                if (typeof src !== 'object' || src === null) {
                    clone = (Array.isArray(val)) ? [] : {};
                    target[key] = _deepExtend(clone, val);
                    continue;
                }

                if (Array.isArray(val)) {
                    clone = (Array.isArray(src)) ? src : [];
                } else {
                    clone = (!Array.isArray(src)) ? src : {};
                }

                target[key] = _deepExtend(clone, val);
            }
        });

        return target;
    }

    //Return the module value
    return {
        resolve: _resolve

    };
});