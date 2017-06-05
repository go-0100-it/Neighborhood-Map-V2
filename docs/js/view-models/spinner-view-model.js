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

            //
            this.template = ko.observable();

            //
            return this;
        };

        //
        return SpinnerViewModel;
    });