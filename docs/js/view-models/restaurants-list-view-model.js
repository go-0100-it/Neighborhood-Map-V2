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
        var RestaurantsListViewModel = function(place, data, isError, main) {

            //
            var _this = this;

            //
            this.template = ko.observable();

            //
            this.showTab = ko.observable(true);

            //
            var Main = main;

            //
            this.id = ko.observable(place.id);

            //
            this.name = ko.observable(place.name);

            //
            this.address = ko.observable(place.address);

            //
            this.lat = ko.observable(place.lat);

            //
            this.lng = ko.observable(place.lng);

            //
            this.data = ko.observableArray(data);

            //
            this.isErr = ko.observable(isError);




            /**
             * @param {object} place - 
             */
            this.addPlace = function(place) {
                var newPlace = {
                    name: place.restaurant.name,
                    lat: Number(place.restaurant.location.latitude),
                    lng: Number(place.restaurant.location.longitude),
                    address: place.restaurant.location.address,
                    id: place.restaurant.location.zipcode + place.restaurant.id
                };
                alert('Adding new place ');
                console.dir(newPlace);
                Main.drawerListViewModel.addPlace(newPlace);
            };

            //
            return this;
        };

        //
        return RestaurantsListViewModel;
    });