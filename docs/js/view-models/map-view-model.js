/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'backbone',
        'underscore',
        'knockout'
    ],
    function($, Backbone, _, ko) {
        var MapViewModel = function() {
            var _this = this;
            this.showMap = ko.observable(true);
            return this;
        };
        return MapViewModel;
    });