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

            // Getting a reference to this execution context for later reference.
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