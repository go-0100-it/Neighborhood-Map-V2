/**
 * Using Require.js to define a module responsible for creating a Map object.
 */
define([
        'jquery',
        'knockout',
        'map_view_model',
        'util'
    ],
    function(
        $,
        ko,
        MapViewModel,
        tpl
    ) {


        /**
         * @constructor - A function constructor to create a Map object which is responsible for all functions related to rendering and
         * manipulating the google map including searching for addresses, adding markers and info windows.
         * @return {object} - Returns a Map object.
         */
        var Map = function() {

            // Getting a reference to this Map objects execution context for later reference.
            var _this = this;

            // Boolean value to be set when the search function is processing a search value.
            this.searching = false;

            // Declaring and intializing an array to keep the created map markers.
            this.markers = [];

            // Declaring and initializing an array to keep the created info windows.
            this.infoWindows = [];

            // Declaring and intitializong a variable for reference to the currently open info window.
            this.openWindow = null;

            // Declaring and intitializong a variable for reference to the marker corresponding to the currently open info window.
            this.openMarker = null;



            /**
             * A function to initialize the map.  Intitialization will create the map viewModel, render the map html template and 
             * create a new google map.
             */
            this.init = function() {

                // Checking that google and google maps has been loaded.
                if (typeof google === 'object' && typeof google.maps === 'object') {

                    // Creating the map view model.
                    _this.mapViewModel = new MapViewModel();

                    // Adding the map html template to render the map container.
                    _this.mapViewModel.template(tpl.get('map'));

                    // Applying KO's bindings to the map container.  Only using to hide and show the map.
                    ko.applyBindings(_this.mapViewModel, $('#map-container-view')[0]);


                    // Creating a google.maps.Map object which is the actual map.
                    _this.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 8
                    });
                    
                } else {

                    // If google or google.maps has not been loaded alert the user.
                    alert("Google's Maps API is currently unavailable");
                }
            };




            /**
             * A function necessary to refresh the map when unhiding.  If this is not called when unhiding the map the map does not seem
             * to rerender properly.
             * @param {object} loc - the location object containing the latitude and longitude coordinates to center the map to.
             */
            this.refreshMap = function(loc) {

                // Triggering the google maps resize event to help spur the rerendering of the map.
                google.maps.event.trigger(_this.map, 'resize');

                // Calling the custom centerOnLocation function which will cause the view to pan to the map location coordinates passed in.
                _this.centerOnLocation(loc);
            };




            /**
             * 
             * @param {object} infoWindow - 
             * @param {object} marker - 
             * @param {object} map - 
             */
            this.openInfoWindow = function(infoWindow, marker, map) {
                _this.openMarker = marker;
                _this.openWindow = infoWindow;
                infoWindow.open(map, marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
            };




            /**
             * 
             * @param {object} map - 
             */
            this.closeInfoWindow = function(map) {
                _this.openWindow.close(map, _this.openMarker);
                _this.openMarker.setAnimation(null);
                _this.openMarker = null;
                _this.openWindow = null;
            };


            /**
             * 
             * @param {array} places - 
             */
            this.initMarkers = function(places) {
                var len = places.length;

                /** */
                for (var i = 0; i < len; i++) {
                    _this.addMarker(places[i]);
                }
            };


            /**
             * 
             * @param {object} place -
             */
            this.addMarker = function(place) {


                //
                var marker = new google.maps.Marker({
                    position: { lat: place.lat, lng: place.lng },
                    title: place.name,
                    animation: google.maps.Animation.DROP
                });


                //
                _this.markers.push(marker);


                //
                var infowindow = new google.maps.InfoWindow({
                    content: '<div class="info-window-container">' +
                        '<div class="info-window">' +
                        '<h1>' + place.name + '</h1>' +
                        '<img id="info-img" src="https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + place.address + '&pitch=2&key=AIzaSyBSpWUS_wBjBq5kXfnbQO19ewpQPdStRDg">' +
                        '<h3>' + place.address + '</h3>' +
                        '<h3>Latitude: ' + place.lat + '&nbsp&nbsp Longitude: ' + place.lng + '</h3>' +
                        '<button type="submit" class="map-info-btn" id="infoWin-' + place.id + '">Get Info</button>' +
                        '</div>' +
                        '</div>',
                    place: place,
                    clickListenerAdded: false
                });

                _this.infoWindows.push(infowindow);


                /**
                 * 
                 * @param {object} _infowindow - The title of the book.
                 * @param {object} _map - The author of the book.
                 * @param {object} _marker - The title of the book.
                 * @param {object} _place - The author of the book.
                 */
                (function(_infowindow, _map, _marker, _place) {

                    //
                    google.maps.event.addDomListener(_infowindow, 'domready', function() {

                        //
                        if (!_infowindow.clickListenerAdded) {

                            $('#infoWin-' + _infowindow.place.id).click(function() {
                                Backbone.history.navigate('#events/' + _infowindow.place.id + '/' + _infowindow.place.name + '/' + _infowindow.place.address + '/' + _infowindow.place.lat + '/' + _infowindow.place.lng, { trigger: true });
                            });

                            //
                            _infowindow.clickListenerAdded = true;
                        }


                        //
                        var btnOverlay = $("img[src$='maps.gstatic.com/mapfiles/transparent.png']")[0];
                        var closeBtn = $("img[src$='maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png']")[0];

                        //
                        if (typeof btnOverlay === 'object') {
                            btnOverlay.addEventListener('click', function() {
                                _this.closeInfoWindow(_map);
                            });
                        }

                        //
                        if (typeof closeBtn === 'object') {
                            closeBtn.addEventListener('click', function() {
                                _this.closeInfoWindow(_map);
                            });
                        }
                    });



                    //
                    _marker.addListener('click', function() {
                        _this.toggleWindowsMarkers(_infowindow, _marker, _map);
                        // TODO check if window is open.
                    });


                    //
                    setTimeout(function() {
                        _marker.setMap(_map);
                    }, 300);
                })(infowindow, _this.map, marker, place);

            };




            /**
             * 
             * @param {object} infowindow -
             * @param {object} marker -
             * @param {object} map -
             */
            this.toggleWindowsMarkers = function(infowindow, marker, map) {

                //
                if (_this.openWindow === null) {
                    _this.openInfoWindow(infowindow, marker, map);

                    //
                } else {

                    //
                    if (marker !== _this.openMarker) {
                        _this.closeInfoWindow(map);
                        _this.openInfoWindow(infowindow, marker, map);
                    } else {
                        _this.closeInfoWindow(map);
                    }

                }
            };




            /**
             * 
             * @param {number} index - 
             */
            this.removeMarker = function(index) {
                _this.markers[index].setMap(null);
                _this.infoWindows.splice(index, 1);
                _this.markers.splice(index, 1);
            };




            /**
             * 
             * @param {number} index - 
             */
            this.hideAllMarkers = function() {
                $.each(_this.markers, function(index, marker) {
                    marker.setMap(null);
                });

            };




            this.showMarker = function(index) {
                var marker = _this.markers[index];
                marker.setMap(_this.map);
            };




            /**
             * 
             * @param {number} index - 
             */
            this.showAllMarkers = function() {
                $.each(_this.markers, function(index, marker) {
                    marker.setMap(_this.map);
                })
            };




            /**
             * 
             * @param {object} loc - 
             */
            this.centerOnLocation = function(loc) {
                _this.map.panTo(loc);
            };




            /**
             * 
             * @param {string} value - 
             * @param {object} searchResults - 
             */
            this.searchAddress = function(value, searchResults) {

                //
                if (typeof google === 'object' && typeof google.maps === 'object' && !_this.searching) {

                    //
                    _this.searching = true;

                    //
                    var geocoder = new google.maps.Geocoder();

                    //
                    geocoder.geocode({ 'address': value }, function(results, status) {

                        //
                        searchResults([]);

                        //
                        if (status == 'OK' && value !== '' && value !== ' ') {
                            var i = 0;

                            //
                            results.forEach(function(result) {
                                if (i < 5) {
                                    searchResults.push(result);
                                }
                                i += 1;
                            });

                            //
                        } else {
                            console.log('Geocode was not successful. Status Code: ' + status);
                            searchResults([]);
                        }
                    });
                } else {
                    console.log("Google's Geocoder API is currently unavailable.");
                }
                _this.searching = false;
            };
        };
        return Map;
    });