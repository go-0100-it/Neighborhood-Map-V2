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

            // Getting a reference to this execution context for later reference.
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
             * insert a new google map into the template.
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
             * A function to open the info window and all other related tasks.
             * @param {object} infoWindow - the info window to open (render to the view)
             * @param {object} marker - the marker that corresponds to the info window passed in.
             * @param {object} map - the map object to render the info window.
             */
            this.openInfoWindow = function(infoWindow, marker, map) {

                // Setting the marker object passed in to the openMarker property for future reference.
                _this.openMarker = marker;

                // Setting the infoWindow object passed in to the openWindow property for future reference.
                _this.openWindow = infoWindow;

                // Calling the open window function to open the info window.
                infoWindow.open(map, marker);

                // Mark the associated marker bounce when the info window is open.
                marker.setAnimation(google.maps.Animation.BOUNCE);
            };




            /**
             * A function to close the info window and all other related tasks.
             * @param {object} map - 
             */
            this.closeInfoWindow = function(map) {

                // Calling the closeWindow function to close the currently open window.
                _this.openWindow.close(map, _this.openMarker);

                // Removing the animation set to the marker when opening the info window.
                _this.openMarker.setAnimation(null);

                // Clearing the open marker reference.
                _this.openMarker = null;

                // Clearing the open window reference.
                _this.openWindow = null;
            };


            /**
             * A function to initialize the adding of markers to the map.  Loops through the places array passed in
             * and cals the addMarkers function for each place in the array.
             * @param {array} places - The array of places to add markers for.
             */
            this.initMarkers = function(places) {

                // Getting the length of the array
                var len = places.length;

                // looping for the length of the array.
                for (var i = 0; i < len; i++) {

                    // calling the addMarker function and passing in the place object at this iteration.
                    _this.addMarker(places[i]);
                }
            };


            /**
             * A function to create the marker and info window objects and 
             * @param {object} place -
             */
            this.addMarker = function(place) {

                // Creating a new map marker
                var marker = new google.maps.Marker({
                    position: { lat: place.lat, lng: place.lng },
                    title: place.name,
                    animation: google.maps.Animation.DROP
                });


                // Saving the marker to an array for future reference
                _this.markers.push(marker);


                // Creating the custom info window to contain the place img, place details and a button to request more info.
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

                // Saving the info window to an array for future reference.
                _this.infoWindows.push(infowindow);


                /**
                 * A immediately invoked function to create a closure for each marker and info window passed in.  Using to add
                 * event listeners to both the markers and info windows
                 * @param {object} _infowindow - the info window to add the event listeners to.
                 * @param {object} _map - the map containing the info window and marker.
                 * @param {object} _marker - the marker to add the event listeners to.
                 * @param {object} _place - the place object the marker and info window were created for.
                 */
                (function(_infowindow, _map, _marker, _place) {

                    // Adding a Dom listener event to get a callback when the Dom has been rendered.
                    google.maps.event.addDomListener(_infowindow, 'domready', function() {

                        // Checking if a click listener has already beem added to this info window.
                        if (!_infowindow.clickListenerAdded) {

                            // if a click listener has not been added then add one
                            $('#infoWin-' + _infowindow.place.id).click(function() {

                                // the callback function will navigate to the events tab for the place corresponding to the info window.
                                Backbone.history.navigate('#events/' + _infowindow.place.id + '/' + _infowindow.place.name + '/' + _infowindow.place.address + '/' + _infowindow.place.lat + '/' + _infowindow.place.lng, { trigger: true });
                            });

                            // Set the listener added flag to true.
                            _infowindow.clickListenerAdded = true;
                        }


                        // get a reference to the info windows close button.  This is needed to sync the marker animation to the info 
                        // window open and close.
                        var btnOverlay = $("img[src$='maps.gstatic.com/mapfiles/transparent.png']")[0];
                        var closeBtn = $("img[src$='maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png']")[0];

                        // if the btnOverlay element exists then add a click listener to call the closeInfoWindow function that indirectly 
                        // stops the associated marker animation.  
                        if (typeof btnOverlay === 'object') {
                            btnOverlay.addEventListener('click', function() {
                                _this.closeInfoWindow(_map);
                            });
                        }

                        // if the closeBtn element exists then add a click listener to call the closeInfoWindow function that indirectly 
                        // stops the associated marker animation.  
                        if (typeof closeBtn === 'object') {
                            closeBtn.addEventListener('click', function() {
                                _this.closeInfoWindow(_map);
                            });
                        }
                    });



                    // add a click listener to the marker to also close and open the info window and start and stop the markers
                    // animation.
                    _marker.addListener('click', function() {
                        _this.toggleWindowsMarkers(_infowindow, _marker, _map);
                    });

                    // rendering the marker in the map.
                    _marker.setMap(_map);

                    // immediately invoking this function to encapsulate the references.
                })(infowindow, _this.map, marker, place);

            };




            /**
             * A function to syncronously toggle open and closed the info windows and add and remove the Bounce animation for the markers.
             * @param {object} infowindow - the info window to toogle open/close
             * @param {object} marker - the marker to add/remove the animation
             * @param {object} map - the map containing the info window and marker
             */
            this.toggleWindowsMarkers = function(infowindow, marker, map) {

                // if no info window is currenly open then open the info window passed in.
                if (_this.openWindow === null) {
                    _this.openInfoWindow(infowindow, marker, map);

                    // if there is currently an info window open
                } else {

                    // and if the marker passed in is not the currently open marker then close the currently open window and then
                    // open the info window passed in.
                    if (marker !== _this.openMarker) {
                        _this.closeInfoWindow(map);
                        _this.openInfoWindow(infowindow, marker, map);

                    // if the marker passed in is the currenly open marker then close the info window passed in.
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