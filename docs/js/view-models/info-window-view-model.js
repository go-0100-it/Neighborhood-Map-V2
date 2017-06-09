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
        var InfoWindowViewModel = function(mapViewModel) {

            var _this = this;

            this.place = ko.observable({ name: 'Loading', lat: '', lng: '', address: '' });

            this.loc = ko.computed(function() {
                return 'Latitude: ' + _this.place().lat + '   Longitude: ' + _this.place().lng;
            });

            this.imgSrc = ko.computed(function() {
                console.log("figuring src");
                console.log(_this.place().name);
                return _this.place().name === 'Loading' ? 'res/images/loading-1.gif' : 'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + _this.place().address + '&pitch=2&key=AIzaSyBSpWUS_wBjBq5kXfnbQO19ewpQPdStRDg';
            });

            this.mapViewModel = mapViewModel;

            this.getInfo = function() {

                // navigate to the tabs events view
                Backbone.history.navigate('#events/' + _this.place().id + '/' + _this.place().name + '/' + _this.place().address + '/' + _this.place().lat + '/' + _this.place().lng, { trigger: true });
            };

            // returning this MapViewModel
            return this;
        };

        // returning the MapViewModel constructor
        return InfoWindowViewModel;
    });