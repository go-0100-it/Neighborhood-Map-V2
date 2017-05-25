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
        var EventsView = Backbone.View.extend({
            el: '#container-view',
            initialize: function() {
                this.template = _.template(tpl.get('tabs-view'));
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            }
        });
        return EventsView;
    });