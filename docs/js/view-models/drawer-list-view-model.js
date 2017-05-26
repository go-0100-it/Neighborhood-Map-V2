/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'knockout'
    ],
    function($, ko) {

        /**
         * @param {function} func - The title of the book.
         * @param {string} id - The author of the book.
         */
        var DrawerListViewModel = function(places) {
            var _this = this;
            this.template = ko.observable();
            this.id = ko.observable();
            this.name = ko.observable();

            /**
             * 
             */
            this.name.subscribe(function() {
                _this.nameRequestVisible(false);
            });
            this.searchResults = ko.observableArray([]);
            this.selectedPlace = ko.observable({});
            this.selectedFormattedAddress = ko.observable('');
            this.searchInput = ko.observable('');
            this.filterInput = ko.observable('');
            this.addressSearchVisible = ko.observable(false);
            this.filterVisible = ko.observable(false);
            this.searchInputVisible = ko.observable(true);
            this.selectedPlaceDisplayVisible = ko.observable(false);
            this.addButtonVisible = ko.observable(false);
            this.nameRequestVisible = ko.observable(false);
            this.places = ko.observableArray(places);

            this.filteredPlaces = ko.computed(function() {
                if (_this.filterInput().length > 0) {
                    _this.map.hideAllMarkers();
                    var placesArray = _this.places();
                    return ko.utils.arrayFilter(placesArray, function(place) {
                        if (place.name.toLowerCase().indexOf(_this.filterInput().toLowerCase()) > -1) {
                            var index = _this.places().indexOf(place);
                            _this.map.showMarker(index);
                            return place;
                        } else {
                            return false;
                        }
                    });
                } else {
                    if (_this.map) {
                        _this.map.showAllMarkers();
                    }
                    return _this.places();
                }
            }).extend({ throttle: 500 });

            this.expanded = ko.observable(false);
            this.expandedClass = ko.observable('');

            /**
             * 
             */
            this.toggleDrawerList = function() {
                if (_this.expanded()) {
                    _this.expandedClass('');
                } else {
                    _this.expandedClass('responsive');
                }
                _this.expanded(!_this.expanded());
            };

            this.onClick = function(place) {

                if (!_this.map.mapViewModel.showMap()) {
                    Backbone.history.navigate('#places/' + place.id + '/' + place.name + '/' + place.address + '/' + place.lat + '/' + place.lng, { trigger: true });
                    _this.centerLocation(place);
                } else {
                    _this.centerLocation(place);
                }
                _this.toggleDrawerList();
            };

            /**
             * @param {} place - The title of the book.
             */
            this.onSelectAddress = function(place) {
                _this.selectedPlace(place);
                _this.selectedFormattedAddress(_this.selectedPlace().formatted_address);
                _this.toggleSearchInput();
                _this.toggleSelectedPlace();
                _this.toggleAddButton();
                _this.searchResults([]);
            };


            /**
             * 
             * @param {string} value - 
             */
            this.searchAddress = function(value) {
                _this.map.searchAddress(value, _this.searchResults);
            };


            this.clickAdd = function() {
                if (_this.name()) {
                    _this.nameRequestVisible(false);
                    var newPlace = { id: _this.selectedPlace().place_id, name: _this.name(), address: _this.selectedPlace().formatted_address, lat: _this.selectedPlace().geometry.location.lat(), lng: _this.selectedPlace().geometry.location.lng() };
                    _this.addPlace(newPlace);
                    _this.toggleAddressSearch();
                    _this.resetSearchView();
                    _this.name('');
                    _this.searchInput('');
                } else {
                    _this.nameRequestVisible(true);
                }
            };


            /**
             * @param {function} func - The title of the book.
             * @param {string} id - The author of the book.
             */
            this.addPlace = function(place) {
                console.log(place);
                if (place) {
                    _this.pushPlace(place);
                    _this.updatePlacesData(place);
                }
            };


            /**
             * @param {function} func - The title of the book.
             */
            this.pushPlace = function(place) {
                _this.map.addMarker(place);
                _this.places.push(place);
            };


            /**
             * 
             */
            this.removePlace = function() {
                var targetIndex = _this.places.indexOf(this);
                if (_this.map.hiddenMarkers) {
                    var markerIndex = _this.map.hiddenMarkers.indexOf(targetIndex);
                    if (markerIndex > -1) {
                        _this.map.hiddenMarkers.splice(markerIndex, 1);
                    }
                }
                _this.map.removeMarker(_this.places.indexOf(this));
                _this.places.remove(this);
                _this.removePlaceData(this);
            };


            /**
             * 
             */
            this.toggleAddressSearch = function() {
                _this.filterInput('');
                _this.filterVisible(false);
                _this.addressSearchVisible(!_this.addressSearchVisible());
            };


            /**
             * 
             */
            this.toggleSearchInput = function() {
                _this.searchInputVisible(!_this.searchInputVisible());
            };

            /**
             * A function to show/hide the filter function view elements upon button click.
             */
            this.toggleFilter = function() {
                _this.addressSearchVisible(false);
                _this.filterInput('');
                _this.filterVisible(!_this.filterVisible());
            };


            /**
             * 
             */
            this.toggleSelectedPlace = function() {
                _this.selectedPlaceDisplayVisible(!_this.selectedPlaceDisplayVisible());
            };


            /**
             * 
             */
            this.toggleAddButton = function() {
                _this.addButtonVisible(!_this.addButtonVisible());
            };


            /**
             * @param {object} place - 
             * 
             */
            this.centerLocation = function(place) {
                var index = _this.places.indexOf(place);
                var loc = { lat: place.lat, lng: place.lng };
                _this.map.centerOnLocation(loc);
                if (_this.map.openWindow !== _this.map.infoWindows[index]) {
                    _this.map.toggleWindowsMarkers(_this.map.infoWindows[index], _this.map.markers[index], _this.map);
                }
            };


            /**
             * 
             */
            this.resetSearchView = function() {
                _this.nameRequestVisible(false);
                _this.toggleSearchInput();
                _this.toggleSelectedPlace();
                _this.toggleAddButton();
            };


            /**
             * 
             */
            this.searchInput.subscribe(this.searchAddress);

            /** */
            return this;
        };

        /** */
        return DrawerListViewModel;
    });