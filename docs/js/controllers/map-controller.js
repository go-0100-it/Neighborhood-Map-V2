/**
 * Using Require.js to define a module responsible for creating a Map object.  This map object is responsible for creating, rendering and
 * handling all user interactions with a Google map.
 */
define([
        'jquery',
        'knockout',
        'map_view_model',
        'info_window_view_model',
        'util'
    ],
    function(
        $,
        ko,
        MapViewModel,
        InfoWindowViewModel,
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

            this.windowBindingsApplied = false;



            /**
             * A function to initialize the map.  Intitialization will create the map viewModel, render the map html template and 
             * insert a new google map into the template.
             */
            this.init = function() {

                // Checking that google and google maps has been loaded.
                if (typeof google === 'object' && typeof google.maps === 'object') {

                    // Creating the map view model.
                    _this.mapViewModel = new MapViewModel();

                    // Creating the map view model.
                    _this.infoWindowViewModel = new InfoWindowViewModel();

                    // Adding the map html template to render the map container.
                    _this.mapViewModel.template(tpl.get('map'));

                    // Creating the custom info window to contain the place img, place details and a button to request more info.
                    _this.infowindow = new google.maps.InfoWindow({
                        content: '<div id="info-window-container" class="info-window-container">' +
                            '<div class="info-window">' +
                            '<h1 databind="text,  place.name"></h1>' +
                            '</div>' +
                            '</div>'
                    });

                    // Applying KO's bindings to the map container.  Only using to hide and show the map.
                    ko.applyBindings(_this.mapViewModel, $('#map-container-view')[0]);

                    google.maps.event.addDomListener(_this.infowindow, 'domready', function() {
                        console.log('Applying Bindings');
                        if (!_this.windowBindingsApplied) {
                            ko.cleanNode($('#map-container-view')[0]);
                            ko.applyBindings(_this.mapViewModel, $('#map-container-view')[0]);
                            _this.windowBindingsApplied = true;
                        }
                    });


                    // Creating a google.maps.Map object which is the actual map.
                    _this.map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 8
                    });


                    google.maps.event.addListener(_this.infowindow, "closeclick", function(e) {
                        _this.toggleWindowsMarkers(_this.openMarker, _this.map);
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
            this.openInfoWindow = function(marker, map) {

                // Setting the marker object passed in to the openMarker property for future reference.
                _this.openMarker = marker;

                // Setting the infoWindow object passed in to the openWindow property for future reference.
                _this.openWindow = _this.infowindow;

                // var content = _this.createContent(marker.place);

                // Calling the open window function to open the info window.
                _this.infowindow.open(map, marker);

                // _this.infowindow.setContent(content);
                _this.mapViewModel.place(marker.place);

                // Mark the associated marker bounce when the info window is open.
                marker.setAnimation(google.maps.Animation.BOUNCE);
            };




            /**
             * A function to close the info window and all other related tasks.
             * @param {object} map - 
             */
            this.closeInfoWindow = function(map) {

                // Calling the closeWindow function to close the currently open window.
                _this.infowindow.close(map, _this.openMarker);

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

            this.createContent = function(place) {
                return '<div class="info-window-container">' +
                    '<div class="info-window">' +
                    '<h1>' + place.name + '</h1>' +
                    '<img id="info-img" src="https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + place.address + '&pitch=2&key=AIzaSyBSpWUS_wBjBq5kXfnbQO19ewpQPdStRDg">' +
                    '<h3>' + place.address + '</h3>' +
                    '<h3>Latitude: ' + place.lat + '&nbsp&nbsp Longitude: ' + place.lng + '</h3>' +
                    '<button databind="click, getInfo" type="submit" class="map-info-btn" id="infoWin-' + place.id + '">Get Info</button>' +
                    '</div>' +
                    '</div>';
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

                marker.place = place;


                // Saving the marker to an array for future reference
                _this.markers.push(marker);


                // // Creating the custom info window to contain the place img, place details and a button to request more info.
                // var infowindow = new google.maps.InfoWindow({
                //     content: '<div class="info-window-container">' +
                //         '<div class="info-window">' +
                //         '<h1>' + place.name + '</h1>' +
                //         '<img id="info-img" src="https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + place.address + '&pitch=2&key=AIzaSyBSpWUS_wBjBq5kXfnbQO19ewpQPdStRDg">' +
                //         '<h3>' + place.address + '</h3>' +
                //         '<h3>Latitude: ' + place.lat + '&nbsp&nbsp Longitude: ' + place.lng + '</h3>' +
                //         '<button type="submit" class="map-info-btn" id="infoWin-' + place.id + '">Get Info</button>' +
                //         '</div>' +
                //         '</div>',
                //     place: place,
                //     clickListenerAdded: false
                // });

                // // Saving the info window to an array for future reference.
                // _this.infoWindows.push(infowindow);

                marker.addListener('click', function() {
                    _this.toggleWindowsMarkers(marker, _this.map);
                });


                /**
                 * A immediately invoked function to create a closure for each marker and info window passed in.  Using to add
                 * event listeners to both the markers and info windows
                 * @param {object} _infowindow - the info window to add the event listeners to.
                 * @param {object} _map - the map containing the info window and marker.
                 * @param {object} _marker - the marker to add the event listeners to.
                 * @param {object} _place - the place object the marker and info window were created for.
                 */
                // (function(_infowindow, _map, _marker, _place) {

                //     // Adding a Dom listener event to get a callback when the Dom has been rendered.
                //     google.maps.event.addDomListener(_infowindow, 'domready', function() {

                //         // Checking if a click listener has already beem added to this info window.
                //         if (!_infowindow.clickListenerAdded) {

                //             // if a click listener has not been added then add one
                //             $('#infoWin-' + _infowindow.place.id).click(function() {

                //                 // the callback function will navigate to the events tab for the place corresponding to the info window.
                //                 Backbone.history.navigate('#events/' + _infowindow.place.id + '/' + _infowindow.place.name + '/' + _infowindow.place.address + '/' + _infowindow.place.lat + '/' + _infowindow.place.lng, { trigger: true });
                //             });

                //             // Set the listener added flag to true.
                //             _infowindow.clickListenerAdded = true;
                //         }


                //         // get a reference to the info windows close button.  This is needed to sync the marker animation to the info 
                //         // window open and close.
                //         var btnOverlay = $("img[src$='maps.gstatic.com/mapfiles/transparent.png']")[0];
                //         var closeBtn = $("img[src$='maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png']")[0];

                //         // if the btnOverlay element exists then add a click listener to call the closeInfoWindow function that indirectly 
                //         // stops the associated marker animation.  
                //         if (typeof btnOverlay === 'object') {
                //             btnOverlay.addEventListener('click', function() {
                //                 _this.closeInfoWindow(_map);
                //             });
                //         }

                //         // if the closeBtn element exists then add a click listener to call the closeInfoWindow function that indirectly 
                //         // stops the associated marker animation.  
                //         if (typeof closeBtn === 'object') {
                //             closeBtn.addEventListener('click', function() {
                //                 _this.closeInfoWindow(_map);
                //             });
                //         }
                //     });



                //     // add a click listener to the marker to also close and open the info window and start and stop the markers
                //     // animation.
                //     _marker.addListener('click', function() {
                //         _this.toggleWindowsMarkers(_infowindow, _marker, _map);
                //     });

                //     // rendering the marker in the map.
                //     _marker.setMap(_map);

                //     // immediately invoking this function to encapsulate the references.
                // })(infowindow, _this.map, marker, place);

            };




            /**
             * A function to syncronously toggle open and closed the info windows and add and remove the Bounce animation for the markers.
             * @param {object} infowindow - the info window to toogle open/close
             * @param {object} marker - the marker to add/remove the animation
             * @param {object} map - the map containing the info window and marker
             */
            this.toggleWindowsMarkers = function(marker, map) {

                // if no info window is currenly open then open the info window passed in.
                if (_this.openMarker === null) {
                    _this.openInfoWindow(marker, map);

                    // if there is currently an info window open
                } else {

                    // and if the marker passed in is not the currently open marker then close the currently open window and then
                    // open the info window passed in.
                    if (marker !== _this.openMarker) {
                        _this.closeInfoWindow(map);
                        _this.openInfoWindow(marker, map);

                        // if the marker passed in is the currenly open marker then close the info window passed in.
                    } else {
                        _this.closeInfoWindow(map);
                    }

                }
            };




            /**
             * A function used to remove a marker and the associated info window from the map.
             * @param {number} index - the index of the marker and info window to be removed. 
             */
            this.removeMarker = function(index) {

                // removing the marker from the map
                _this.markers[index].setMap(null);

                // removing the info window from the array of info windows
                _this.infoWindows.splice(index, 1);

                // removing the marker from the array of map markers
                _this.markers.splice(index, 1);
            };




            /**
             * A function to remove all markers from the map.
             * Using this function to clear the map of all markers when filtering.
             */
            this.hideAllMarkers = function() {

                // looping through the array of markers and removing each from the marker.
                $.each(_this.markers, function(index, marker) {

                    // removing the marker form the map.
                    marker.setMap(null);
                });

            };




            /**
             * A function add back to the map an individual previously hidden marker.
             * @param {number} index - the index of the marker to add back to the marker.
             */
            this.showMarker = function(index) {
                var marker = _this.markers[index];
                marker.setMap(_this.map);
            };




            /**
             * A function to show all the markers.  Using this function to re-show all the markers after filtering, when no filter is applied. 
             */
            this.showAllMarkers = function() {

                // looping through the array of markers and adding each back to the map.
                $.each(_this.markers, function(index, marker) {

                    // Adding marker to the map.
                    marker.setMap(_this.map);
                });
            };




            /**
             * A function to center the map on a particular coordinates.
             * @param {object} loc - the coordinates to center the map on.
             */
            this.centerOnLocation = function(loc) {
                _this.map.panTo(loc);
            };




            /**
             * A function to search google geocoder for locations via addresses.  
             * @param {string} value - the value to pass to google geocoder to search for matching addresses.
             * @param {object} searchResults - the KO observable array used to store the results returned from google geocoder and update the view.
             */
            this.searchAddress = function(value, searchResults) {

                // Confirming that google and google maps has been loaded and that this code is not still processing another request.
                if (typeof google === 'object' && typeof google.maps === 'object' && !_this.searching) {

                    // Setting the searching flag to true to ensure this request has completed before processing another request.
                    _this.searching = true;

                    // Creating a Geocoder object to handle the request.
                    var geocoder = new google.maps.Geocoder();

                    // Calling the geocoders geocode function the value to search for and the callback function to be called when a result has been returned.
                    geocoder.geocode({ 'address': value }, function(results, status) {

                        // Clearing the observable array, this also triggers KO to clear the view.
                        searchResults([]);

                        // Ensuring a value is returned from the geocoder.
                        if (status == 'OK' && value !== '' && value !== ' ') {
                            var i = 0;

                            // looping the results and adding up to 5 to the searchResults observable.  This limits the results displayed to 5. 
                            results.forEach(function(result) {
                                if (i < 5) {
                                    searchResults.push(result);
                                }
                                i += 1;
                            });

                            // if no value is returned from the geocoder.
                        } else {

                            // log the lack of results to the console.
                            console.log('Geocode was not successful. Status Code: ' + status);

                            // clear the observable array of the previous values returned, this also clears the display.
                            searchResults([]);
                        }
                    });

                    // if google or google maps has not been loaded.
                } else {

                    // log the status to the console.
                    console.log("Google's Geocoder API is currently unavailable.");
                }

                // this search process is complete so set the searching flag to false to now allow additional searches.
                _this.searching = false;
            };
        };

        // return the map constructor
        return Map;
    });