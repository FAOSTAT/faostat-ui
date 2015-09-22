define([
    'chaplin',
    'fx-dashboard/models/base/model'

], function(Chaplin, Model) {
    'use strict';

    var MapModel = Model.extend({
        defaults: {
            name: '',
            title: 'Map',
            type: 'map'
        },
        url: ''

        // ,initialize: function(attributes, options) {
        //  Model.prototype.initialize.apply(this, arguments);
        //  console.debug('HelloWorld#initialize');
        // }
    });

    return MapModel;
});