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

            this.place = ko.observable({ lat:0, lng:0, address:'' });

            this.loc = ko.computed(function(){
                return 'Latitude: ' + _this.place().lat + '   Longitude: ' + _this.place().lng;
            });

            this.imgSrc = ko.computed(function(){
                return 'https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + _this.place().address + '&pitch=2&key=AIzaSyBSpWUS_wBjBq5kXfnbQO19ewpQPdStRDg';
            });

            this.mapViewModel = mapViewModel;

            this.getInfo = function(){
                alert('Getting Info');
            };

            this.hideMap = function(){
                ko.cleanNode($('#info-window-container')[0]);
                // Applying KO's bindings to the map container.  Only using to hide and show the map.
                ko.applyBindings(_this.mapViewModel, $('#map-container-view')[0]);
                _this.mapViewModel.showMap(false);
            };

            // returning this MapViewModel
            return this;
        };

        // returning the MapViewModel constructor
        return InfoWindowViewModel;
    });