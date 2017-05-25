/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'backbone',
        'underscore',
        'util'
    ],
    function($, Backbone, _, tpl) {
        var MapView = Backbone.View.extend({
            el: '#map-container-view',
            initialize: function() {
                this.template = _.template(tpl.get('map'));
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            }
        });
        return MapView;
    });