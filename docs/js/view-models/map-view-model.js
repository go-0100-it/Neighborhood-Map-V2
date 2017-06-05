/**
 * Using Require.js to define a module responsible for rendering the map view html template
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
        var MapViewModel = function() {

            // creating an observable for the html template
            this.template = ko.observable();

            // creating a observable for toggling the view state.
            this.showMap = ko.observable(true);

            // returning this MapViewModel
            return this;
        };

        // returning the MapViewModel constructor
        return MapViewModel;
    });