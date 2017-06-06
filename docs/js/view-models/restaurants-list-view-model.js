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
         * @constructor - A function constructor to create a KO view model for the restaurants list view. This view model is responsible for all the functions 
         * related to the corresponding restaurants view and creates a two way data binding between the view and the view model for simplifying DOM manipulation.
         * @param {object} place - the place object to fetch the local restaurants for.
         * @param {array} data - the data response from the zomato API request. 
         * @param {boolean} isError - a boolean value indicating if the data request to the zomato API resulted in an error.
         * @param {object} main - a reference to the main controller object.
         */
        var RestaurantsListViewModel = function(place, data, isError, main) {

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showTab = ko.observable(true);

            // keeping reference to the main controller object
            var Main = main;

            // creating an observable for reference to the place's id.
            this.id = ko.observable(place.id);

            // creating an observable for reference to the place's name.
            this.name = ko.observable(place.name);

            // creating an observable for reference to the place's address.
            this.address = ko.observable(place.address);

            // creating an observable for reference to the place's latitude.
            this.lat = ko.observable(place.lat);

            // creating an observable for reference to the place's longitude.
            this.lng = ko.observable(place.lng);

            // creating an observable array for reference to the events array.
            this.data = ko.observableArray(data.events.event);

            // creating an observable to reference if the request result returned an error.
            this.isErr = ko.observable(isError);





            /**
             * A function to delegate to the drawerListViewModels addPlace function, the addition of a new place object to the drawer list.
             * @param {object} place - the event object the user clicked which is to be added to the drawer list.
             */
            this.addPlace = function(place) {

                // creating a new place object from the event object.
                var newPlace = {
                    name: place.restaurant.name,
                    lat: Number(place.restaurant.location.latitude),
                    lng: Number(place.restaurant.location.longitude),
                    address: place.restaurant.location.address,
                    id: place.restaurant.location.zipcode + place.restaurant.id
                };

                // delegating the addition of a new place object to the drawerListViewModel's addPlace function.
                Main.drawerListViewModel.addPlace(newPlace);
            };

            // returning the RestaurantsListViewModel
            return this;
        };

        // returning the RestaurantsListViewModel's constructor
        return RestaurantsListViewModel;
    });