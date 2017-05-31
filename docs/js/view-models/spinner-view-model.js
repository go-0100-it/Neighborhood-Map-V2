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
        var SpinnerViewModel = function(place, data, isError) {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            //
            this.template = ko.observable();

            //
            return this;
        };

        //
        return SpinnerViewModel;
    });