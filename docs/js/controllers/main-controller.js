/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'backbone',
        'underscore',
        'knockout',
        'util',
        'tabs_view_model',
        'tabs_view',
        'events_list_view_model',
        'events_view',
        'weather_list_view_model',
        'weather_view',
        'restaurants_list_view_model',
        'restaurants_view',
        'others_list_view_model',
        'others_view',
        'data_controller',
        'map_controller',
        'firebase_helper'
    ],
    function(
        $,
        backbone,
        _,
        ko,
        tpl,
        TabsViewModel,
        TabsView,
        EventsListViewModel,
        EventsView,
        WeatherListViewModel,
        WeatherView,
        RestaurantsListViewModel,
        RestaurantsView,
        OthersListViewModel,
        OthersView,
        DataController,
        Map,
        FBHelper
    ) {


        /**
         * @constructor - Creates a main controller object.
         * The created main controller object is, as the name implies, the main controller.  It controls the majority of the functions of the application.  
         * Nearly every function of the application is controlled via this main controller object.  The purpose of the main controller is to be 
         * the hub in which all other modules can communicate through and in which all of the main functionality of the application is generated.  Having this 
         * main controller helps to keep concerns seperate and helps keep code modulal and improve maintainability.  
         * @return {object} - returns a new main controller object.
         */
        var Main = function() {
            var _this = this;
            this.map = {};

            /** */
            this.dataController = new DataController();



            /**
             * 
             * @param {object} place - The author of the book.
             */
            this.renderDrawerListView = function(place) {

                //
                require(['drawer_list_view_model', 'drawer_list_view'], function(DrawerListViewModel, DrawerListView) {

                    //
                    var loc = place ? { lat: Number(place.lat), lng: Number(place.lng) } : null;

                    //
                    if (!_this.drawerListView) {

                        //
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                defaultLoc = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                };
                                _this.map.centerOnLocation(defaultLoc);
                            });
                        }

                        //
                        _this.drawerListView = new DrawerListView().render();

                        //
                        _this.eventsViewModel = new DrawerListViewModel();

                        //
                        _this.renderMap();

                        var locationRequest = {};

                        //
                        if (loc) {
                            var isRequested = true;
                            locationRequest = { centerOnLocation: _this.map.centerOnLocation, centerRequested: isRequested, locRequested: loc };
                        }

                        //
                        FBHelper.initAuth(_this.dataController.getUserPlaces, _this.eventsViewModel.pushPlace, locationRequest);




                        /**
                         * 
                         * @param {object} place - 
                         */
                        _this.eventsViewModel.updatePlacesData = function(place) {

                            //
                            _this.dataController.updateUserPlaces(place, FBHelper.uid);
                        };




                        /**
                         * 
                         * @param {object} place - 
                         */
                        _this.eventsViewModel.removePlaceData = function(place) {

                            //
                            _this.dataController.removeUserPlace(place, FBHelper.uid);
                        };

                        //
                        ko.applyBindings(_this.eventsViewModel, $('#drawer-menu-container')[0]);

                        //
                    } else {
                        _this.map.refreshMap(loc);
                    }
                });
            };




            /**
             * 
             * @param {object} loc - 
             */
            this.renderMap = function(loc) {
                _this.map = new Map();
                _this.map.init(loc);
                _this.eventsViewModel.map = _this.map;
            };




            /**
             * @param {object} place - 
             * @param {object} view - 
             */
            this.renderTabsView = function(place, view) {

                //
                _this.renderDrawerListView(place);
                $('#container-view').show();
                $('#map-container-view').hide();

                //
                var viewConfigData = {
                    viewVariable: 'tabsView',
                    viewConstructor: TabsView,
                    viewModelVariable: 'tabsViewModel',
                    viewModelConstructor: TabsViewModel,
                    el: '#tabs-container',
                    place: place
                };

                //
                if (!_this.tabsView) {

                    //
                    _this.renderView(place, viewConfigData);

                    //
                } else {

                    //
                    _this.tabsViewModel.place(place);

                    //
                    $('#tab-container').html(_.template(tpl.get('tabs-spinner-view')));
                }

                //
                switch (view) {
                    case 'events':

                        //
                        viewConfigData = {
                            viewVariable: 'eventsView',
                            viewConstructor: EventsView,
                            viewModelVariable: 'eventsListViewModel',
                            viewModelConstructor: EventsListViewModel,
                            el: '#events-view',
                            place: place
                        };

                        //
                        _this.tabsViewModel.title('Local Events');
                        _this.dataController.queryCache(viewConfigData, _this.dataController.getEventsDataList, _this.renderView);
                        break;

                    case 'weather':

                        //
                        viewConfigData = {
                            viewVariable: 'weatherView',
                            viewConstructor: WeatherView,
                            viewModelVariable: 'weatherListViewModel',
                            viewModelConstructor: WeatherListViewModel,
                            el: '#weather-view',
                            place: place
                        };

                        //
                        _this.tabsViewModel.title('Local Weather');
                        _this.dataController.queryCache(viewConfigData, _this.dataController.getCurrentWeather, _this.renderView);
                        break;

                    case 'restaurants':

                        //
                        viewConfigData = {
                            viewVariable: 'restaurantsView',
                            viewConstructor: RestaurantsView,
                            viewModelVariable: 'restaurantsListViewModel',
                            viewModelConstructor: RestaurantsListViewModel,
                            el: '#restaurants-view',
                            place: place
                        };

                        //
                        _this.tabsViewModel.title('Local Restaurants');
                        _this.dataController.queryCache(viewConfigData, _this.dataController.getRestaurantsList, _this.renderView);
                        break;

                    case 'others':

                        //
                        viewConfigData = {
                            viewVariable: 'othersView',
                            viewConstructor: OthersView,
                            viewModelVariable: 'othersListViewModel',
                            viewModelConstructor: OthersListViewModel,
                            el: '#others-view',
                            place: place
                        };

                        //
                        _this.tabsViewModel.title('Other Places');
                        _this.dataController.queryCache(viewConfigData, _this.dataController.getOthersList, _this.renderView);
                        break;
                }
            };

            /**
             * 
             * @param {object} data - 
             * @param {object} vcd - 
             */
            this.renderView = function(data, vcd, isError) {

                //
                _this[vcd.viewVariable] = new vcd.viewConstructor().render();

                //
                _this[vcd.viewModelVariable] = new vcd.viewModelConstructor({
                        id: vcd.place.id,
                        name: vcd.place.name,
                        address: vcd.place.address,
                        lat: vcd.place.lat,
                        lng: vcd.place.lng
                    },
                    data, isError, _this);

                // Checking if the element has bindings applied. If no bindings have previously been applied to this element then apply bindings. 
                if (!!!ko.dataFor($(vcd.el)[0])) {
                    ko.applyBindings(_this[vcd.viewModelVariable], $(vcd.el)[0]);
                }
            };
        };

        //
        return new Main();
    });