/**
 * Using Require.js to define a module responsible for...
 */
define(
    [
        'jquery',
        'knockout'
    ],
    function(
        $,
        ko
    ) {
        var MapViewModel = function() {

            //
            var _this = this;

            //
            this.template = ko.observable();

            //
            this.showMap = ko.observable(true);

            //
            return this;
        };

        //
        return MapViewModel;
    });