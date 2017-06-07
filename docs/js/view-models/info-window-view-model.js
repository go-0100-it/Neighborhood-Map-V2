/**
 * Using Require.js to define a module responsible for creating a KO view model.
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

        /**
         * A function constructor resposible for creating a KO view model.  This view model is only being used to render the html template
         * for the map view.
         */
        var InfoWindowViewModel = function() {

            // // creating an observable for the html template
            // this.template = ko.observable();

            this.place = ko.observable({ name: 'Tim' });

            // returning this MapViewModel
            return this;
        };

        // returning the MapViewModel constructor
        return InfoWindowViewModel;
    });