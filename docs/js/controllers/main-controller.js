/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'knockout',
        'util',
        'drawer_list_view_model',
        'tabs_view_model',
        'events_list_view_model',
        'weather_list_view_model',
        'restaurants_list_view_model',
        'others_list_view_model',
        'data_controller',
        'map_controller',
        'firebase_helper'
    ],
    function(
        $,
        ko,
        tpl,
        DrawerListViewModel,
        TabsViewModel,
        EventsListViewModel,
        WeatherListViewModel,
        RestaurantsListViewModel,
        OthersListViewModel,
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

            /** */
            this.dataController = new DataController();



            /**
             * 
             * @param {object} place - The author of the book.
             */
            this.renderDrawerListView = function(place) {

                //
                var loc = place ? { lat: Number(place.lat), lng: Number(place.lng) } : null;

                //
                if (!_this.drawerListViewModel) {

                    //
                    _this.drawerListViewModel = new DrawerListViewModel();

                    //
                    ko.applyBindings(_this.drawerListViewModel, $('#nav')[0]);

                    //
                    _this.drawerListViewModel.template(tpl.get('drawer-list-view'));

                    //
                    ko.cleanNode($('#nav')[0]);

                    var locationRequest = {};

                    _this.renderMap(place);

                    //
                    if (loc) {
                        var isRequested = true;
                        locationRequest = { centerOnLocation: _this.map.centerOnLocation, centerRequested: isRequested, locRequested: loc };
                    }
                    //
                    FBHelper.initAuth(_this.dataController.getUserPlaces, _this.drawerListViewModel.pushPlace, locationRequest);




                    /**
                     * 
                     * @param {object} place - 
                     */
                    _this.drawerListViewModel.updatePlacesData = function(place) {

                        //
                        _this.dataController.updateUserPlaces(place, FBHelper.uid);
                    };




                    /**
                     * 
                     * @param {object} place - 
                     */
                    _this.drawerListViewModel.removePlaceData = function(place) {

                        //
                        _this.dataController.removeUserPlace(place, FBHelper.uid);
                    };

                    ko.applyBindings(_this.drawerListViewModel, $('#drawer-menu-container')[0]);
                    //
                } else {
                    _this.renderMap(place);
                }
            };




            /**
             * 
             * @param {object} loc - 
             */
            this.renderMap = function(place) {

                var loc = place ? { lat: Number(place.lat), lng: Number(place.lng) } : null;
                if (_this.map) {
                    if (_this.tabsViewModel) {
                        _this.tabsViewModel.showTabs(false);
                    }
                    _this.map.mapViewModel.showMap(true);
                    _this.map.refreshMap(loc);
                } else {
                    _this.map = new Map();
                    _this.map.init();
                    _this.drawerListViewModel.map = _this.map;
                    //
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var defaultLoc = loc ? loc : {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            _this.map.centerOnLocation(defaultLoc);
                        });
                    }
                }
            };




            /**
             * @param {object} place - 
             * @param {object} view - 
             */
            this.renderTabsView = function(place, view) {

                _this.renderDrawerListView(place);

                if (_this.map.mapViewModel) {
                    _this.map.mapViewModel.showMap(false);
                }

                if (_this.tabsViewModel) {
                    _this.tabsViewModel.place(place);
                    _this.tabsViewModel.showTabs(true);
                } else {
                    //
                    _this.tabsViewModel = new TabsViewModel(place);

                    ko.applyBindings(_this.tabsViewModel, $('#tabs-container-view')[0]);

                    _this.tabsViewModel.template(tpl.get('tabs-view'));

                    ko.cleanNode($('#tabs-container-view')[0]);

                    ko.applyBindings(_this.tabsViewModel, $('#tabs-view')[0]);

                }
                _this.renderTabView(place, view);
            };




            /**
             * @param {object} place - 
             * @param {object} view - 
             */
            this.renderTabView = function(place, view) {
                //
                switch (view) {
                    case 'events':

                        //
                        viewConfigData = {
                            viewVariable: 'eventsView',
                            viewModelVariable: 'eventsListViewModel',
                            viewModelConstructor: EventsListViewModel,
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
                            viewModelVariable: 'weatherListViewModel',
                            viewModelConstructor: WeatherListViewModel,
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
                            viewModelVariable: 'restaurantsListViewModel',
                            viewModelConstructor: RestaurantsListViewModel,
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
                            viewModelVariable: 'othersListViewModel',
                            viewModelConstructor: OthersListViewModel,
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
                _this[vcd.viewModelVariable] = new vcd.viewModelConstructor(vcd.place, data, isError, _this);

                // Checking if the element has bindings applied. If no bindings have previously been applied to this element then apply bindings. 
                if (!!!ko.dataFor($('#tab-container-view')[0])) {
                    ko.applyBindings(_this[vcd.viewModelVariable], $('#tab-container-view')[0]);
                } else {
                    //
                    ko.cleanNode($('#tab-container-view')[0]);
                    ko.applyBindings(_this[vcd.viewModelVariable], $('#tab-container-view')[0]);
                }
                _this[vcd.viewModelVariable].showTab(true);
                _this[vcd.viewModelVariable].template(vcd.template);
            };
        };

        //
        return new Main();
    });