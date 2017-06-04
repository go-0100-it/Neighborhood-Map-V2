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
         * @constructor - A function constructor to create a KO view model for the drawer list view. This view model is responsible for all the functions 
         * related to the corresponding drawer view and creates a two way data binding between the view and the model for simplifying DOM manipulation.
         * @param {array} places - the array of places to render as a list in the drawer list view.
         */
        var DrawerListViewModel = function(places) {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an id observable to keep reference to the user entered place's id when the user is creating a new place.
            this.id = ko.observable();

            // // creating an name observable to keep reference to the user entered place's name when the user is creating a new place.
            this.name = ko.observable();



            /**
             * Calling the subscribe function on the name observable to leverage the change event. If this.name value changes then hide
             * the name request element.  The name request element indicates to the user that a name is required when creating a new place and one has not 
             * been entered prior to adding the new place.
             */
            this.name.subscribe(function() {

                // hide the element when the this.name observable value changes.
                _this.nameRequestVisible(false);
            });

            // creating an observable array for the search results returned from the geocoder query.
            this.searchResults = ko.observableArray([]);

            // creating an observable for the place object that the user selected from the search results list.
            this.selectedPlace = ko.observable({});

            // creating an observable for the formatted address of the place the user selected from the search results list.
            this.selectedFormattedAddress = ko.observable('');

            // creating an observable for the new address input from the user.
            this.searchInput = ko.observable('');

            // creating an observable for the filter input from the user.
            this.filterInput = ko.observable('');

            // creating an observable to show or hide the address search elements
            this.addressSearchVisible = ko.observable(false);

            // creating an observable to show or hide the filter elements
            this.filterVisible = ko.observable(false);

            // creating an observable to show or hide the search input element
            this.searchInputVisible = ko.observable(true);

            // creating an observable to show or hide the selected place display element
            this.selectedPlaceDisplayVisible = ko.observable(false);

            // creating an observable to show or hide the add button
            this.addButtonVisible = ko.observable(false);

            // creating an observable to show or hide the name request element
            this.nameRequestVisible = ko.observable(false);

            // creating an observable array to for the list of user places
            this.places = ko.observableArray(places);



            /**
             * A KO computed observable to filter the list of places. This KO computed will filter the list dynamically as the user types
             * in the filter input.  It also shows and hides the map markers corresponding to the places filtered.
             */
            this.filteredPlaces = ko.computed(function() {

                // if the filter input is not blank
                if (_this.filterInput().length > 0) {

                    // first hide all the markers so we can then add back just the unfiltered ones
                    _this.map.hideAllMarkers();

                    // creating a copy of the places array
                    var placesArray = _this.places();

                    // returning the results of the ko utils arrayFilter.  
                    // Passing to the ko.utils.arrayFilter the callback function to be called on each index of the places array.
                    return ko.utils.arrayFilter(placesArray, function(place) {

                        // if the place at the current index contains the text typed in by the user
                        if (place.name.toLowerCase().indexOf(_this.filterInput().toLowerCase()) > -1) {

                            // get the current index
                            var index = _this.places().indexOf(place);

                            // user the current index to show the corresponding map marker
                            _this.map.showMarker(index);

                            // this place contains the text so return the place
                            return place;

                            // the place name does not contain the text typed in by the user
                        } else {

                            // return false
                            return false;
                        }
                    });

                    // the filter input is blank
                } else {

                    // if a map object exists
                    if (_this.map) {

                        // show all the places corresponding markers
                        _this.map.showAllMarkers();
                    }

                    // return the array of place objects
                    return _this.places();
                }

                // restrict this function to only running every 500ms. 
            }).extend({ throttle: 500 });




            // creating an observable to keep track of the state of the drawer list.
            this.expanded = ko.observable(false);

            // creating an observable to add and remove a css class to style the drawer list.
            this.expandedClass = ko.observable('');




            /**
             * A function to open and close the Drawer List on user click
             */
            this.toggleDrawerList = function() {

                // if the drawer list is open
                if (_this.expanded()) {

                    // remove the css style
                    _this.expandedClass('');

                    // if the drawer is closed
                } else {

                    // add the css style
                    _this.expandedClass('responsive');
                }

                // negate the state :)
                _this.expanded(!_this.expanded());
            };




            /**
             * A function to capture the users clicked place, show the map if not already showing and center the map on the clicked place coordinates.
             * @param {object} place - the place object the user clicked
             */
            this.onClick = function(place) {

                // if the map is not showing
                if (!_this.map.mapViewModel.showMap()) {

                    // navigate to the map view
                    Backbone.history.navigate('#places/' + place.id + '/' + place.name + '/' + place.address + '/' + place.lat + '/' + place.lng, { trigger: true });
                }

                // center the map to the clicked places coordinates.  This will also open the markers info window.
                _this.centerLocation(place);

                // close the drawer list
                _this.toggleDrawerList();
            };




            /**
             * A function to capture the place the user selected as the place data to be added as the users new place.
             * @param {object} place - the place from the results array selected by the user.
             */
            this.onSelectAddress = function(place) {

                // setting the selected places to an observable for later reference.
                _this.selectedPlace(place);

                // setting the selectedPlaces formatted address to an observable for later reference
                _this.selectedFormattedAddress(_this.selectedPlace().formatted_address);

                // hide the search input
                _this.toggleSearchInput();

                // show the selected place display
                _this.toggleSelectedPlace();

                // show the add button
                _this.toggleAddButton();

                // clear the search results
                _this.searchResults([]);
            };




            /**
             * A function to delegate the search request to the map object
             * @param {string} value - the value entered by the user to search for 
             */
            this.searchAddress = function(value) {

                // calling the maps searchAddress function passing the value to search for and a reference to the observable array to store
                // the search results.
                _this.map.searchAddress(value, _this.searchResults);
            };



            /**
             * A function to add the new place entered by the user.
             */
            this.clickAdd = function() {

                // if a name has been entered in the name input
                if (_this.name()) {

                    // hide the name request if it is visible
                    _this.nameRequestVisible(false);

                    // create the new place object
                    var newPlace = { id: _this.selectedPlace().place_id, name: _this.name(), address: _this.selectedPlace().formatted_address, lat: _this.selectedPlace().geometry.location.lat(), lng: _this.selectedPlace().geometry.location.lng() };

                    // call the add place function to add the new place to the drawer list and to update the firebase database
                    _this.addPlace(newPlace);

                    // hide the and clear all the search related elements
                    _this.toggleAddressSearch();
                    _this.resetSearchView();
                    _this.name('');
                    _this.searchInput('');

                    // if a name has not been entered in the name input
                } else {

                    // show the name request message element
                    _this.nameRequestVisible(true);
                }
            };




            /**
             * A function to add the new place to the drawer list and the firebase database
             * @param {object} place - the new place object to add.
             */
            this.addPlace = function(place) {

                // if a place was passed in
                if (place) {

                    // Add the new place to the drawer list and update the database
                    _this.pushPlace(place);
                    _this.updatePlacesData(place);
                }
            };




            /**
             * A function to push a place object to the places array and add a corresponding marker
             * @param {object} place - the place to push to the array
             */
            this.pushPlace = function(place) {

                // add a marker to correspond to the place
                _this.map.addMarker(place);

                // push the new place to the array
                _this.places.push(place);
            };




            /**
             * A function to remove a selected place from the drawer list and from the firebase database and to remove the corresponding
             * map marker.
             */
            this.removePlace = function() {

                // getting the places index
                var targetIndex = _this.places.indexOf(this);

                // if the map has hidden markers
                if (_this.map.hiddenMarkers) {

                    // find the index of the hidden marker.
                    var markerIndex = _this.map.hiddenMarkers.indexOf(targetIndex);

                    // if the markerIndex has a index value
                    if (markerIndex > -1) {

                        // remove the marker index from the hidden marker array
                        _this.map.hiddenMarkers.splice(markerIndex, 1);
                    }
                }

                // remove the marker
                _this.map.removeMarker(_this.places.indexOf(this));

                // remove the place from the array
                _this.places.remove(this);

                // remove the place from the database
                _this.removePlaceData(this);
            };




            /**
             * A function to show or hide the address search elements
             */
            this.toggleAddressSearch = function() {

                // clear the filter input, only necessary if user was filtering prior to adding a new place
                _this.filterInput('');

                // hide the filter elements, only necessary if user was filtering prior to adding a new place
                _this.filterVisible(false);

                // negates the state (shows or hides depending on the previous state)
                _this.addressSearchVisible(!_this.addressSearchVisible());
            };




            /**
             * A function to show or hide the search input element independantly
             */
            this.toggleSearchInput = function() {

                // negates the state (shows or hides depending on the previous state)
                _this.searchInputVisible(!_this.searchInputVisible());
            };




            /**
             * A function to show/hide the filter elements upon button click.
             */
            this.toggleFilter = function() {

                // hide the address search elements, this is only necessary if the user was previously adding a new place.
                _this.addressSearchVisible(false);

                // clearing the filter input, this is only necessary if this is closing the filter.
                _this.filterInput('');

                // negates the state (shows or hides depending on the previous state)
                _this.filterVisible(!_this.filterVisible());
            };




            /**
             * A function to show or hide the selected place display element independantly
             */
            this.toggleSelectedPlace = function() {

                // negates the state (shows or hides depending on the previous state)
                _this.selectedPlaceDisplayVisible(!_this.selectedPlaceDisplayVisible());
            };




            /**
             * A function to show or hide the add button independantly
             */
            this.toggleAddButton = function() {

                // negates the state (shows or hides depending on the previous state)
                _this.addButtonVisible(!_this.addButtonVisible());
            };




            /**
             * A function to delegate to the map module the request to center the map on a given location
             * @param {object} place - the location to center the map
             */
            this.centerLocation = function(place) {

                // getting the index position of the place object in the places array to later get reference the places corresponding 
                // info window.
                var index = _this.places.indexOf(place);

                // creating a location object from the place's coordinates
                var loc = { lat: place.lat, lng: place.lng };

                // calling the center on map function to center the map on the location
                _this.map.centerOnLocation(loc);

                // if the currently open window is not the places corresponding info window
                if (_this.map.openWindow !== _this.map.infoWindows[index]) {

                    // close the open window and open the places corresponding info window.
                    _this.map.toggleWindowsMarkers(_this.map.infoWindows[index], _this.map.markers[index], _this.map);
                }
            };




            /**
             * A function to hide the common elements of the search
             */
            this.resetSearchView = function() {

                // hide the name request element
                _this.nameRequestVisible(false);

                // hide the search input element
                _this.toggleSearchInput();

                // hide the selected place display element
                _this.toggleSelectedPlace();

                // hide the add button
                _this.toggleAddButton();
            };




            /**
             * Subscribing to the change event of the searchInput observable, this will call the searchAddress function every time 
             * the searchInput obsevable is updated.
             */
            this.searchInput.subscribe(this.searchAddress);

            // returning this drawerListViewModel
            return this;
        };

        // returning the DrawerListViewModel constructor
        return DrawerListViewModel;
    });