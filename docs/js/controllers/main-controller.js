/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'knockout',
        'util',
        'drawer_list_view_model',
        'map_controller',
        'firebase_helper',
        'data_controller'
    ],
    function(
        $,
        ko,
        tpl,
        DrawerListViewModel,
        Map,
        FBHelper,
        DataController
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

            // Getting a reference to this execution context for later reference.
            var _this = this;
            let VISIBLE = true;
            let HIDDEN = false;

            /** */
            _this.dataController = new DataController();



            /**
             * 
             * @param {object} place - 
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

                    //
                    _this.renderMap(place);
                }
            };




            /**
             * 
             * @param {object} loc - 
             */
            this.renderMap = function(place) {

                var loc = place ? { lat: Number(place.lat), lng: Number(place.lng) } : null;
                _this.setTabsVisibility(HIDDEN, true);
                _this.setErrorVisibility(HIDDEN);
                if (_this.map) {
                    _this.setMapVisibility(VISIBLE, loc);
                } else {
                    _this.createMap(loc);
                }
            };




            /**
             * 
             * @param {object} place - The author of the book.
             */
            this.createMap = function(loc) {
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
            };




            /**
             * @param {object} place - 
             * @param {object} view - 
             */
            this.renderTabsView = function(place, view) {

                _this.renderDrawerListView(place);
                _this.setMapVisibility(HIDDEN);
                _this.setErrorVisibility(HIDDEN);
                if (_this.tabsViewModel) {
                    _this.setTabsVisibility(VISIBLE, null, place);
                } else {
                    _this.createTabsView(place);
                }
                _this.renderSpinner();
                _this.renderTabView(place, view);
            };




            /**
             * @param {object} place -  
             */
            this.createTabsView = function(place) {

                requirejs(
                    [
                        'tabs_view_model',
                        'css!css/tabs-view.css'
                    ],
                    function(
                        TabsViewModel
                    ) {
                        //
                        _this.tabsViewModel = new TabsViewModel(place);

                        ko.applyBindings(_this.tabsViewModel, $('#tabs-container-view')[0]);

                        _this.tabsViewModel.template(tpl.get('tabs-view'));

                        ko.cleanNode($('#tabs-container-view')[0]);

                        ko.applyBindings(_this.tabsViewModel, $('#tabs-view')[0]);
                    });
            };



            /**
             * A function to initialize the rendering of a tab view. Creates view config data and initializes the data requests.
             * @param {object} place - the place object (location) for which the data is being requested.
             * @param {string} view - the type of view needed to display the requested data.
             */
            this.renderTabView = function(place, view) {
                requirejs(
                    [
                        'css!css/weather-view.css',
                        'css!css/events-view.css',
                        'events_list_view_model',
                        'weather_list_view_model',
                        'restaurants_list_view_model'
                    ],
                    function(
                        weatherCss,
                        eventsCss,
                        EventsListViewModel,
                        WeatherListViewModel,
                        RestaurantsListViewModel
                    ) {
                        //
                        switch (view) {
                            case 'events':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'eventsView',
                                    viewModelVariable: 'eventsListViewModel',
                                    viewModelConstructor: EventsListViewModel,
                                    template: tpl.get('events-view'),
                                    el: '#events-view',
                                    place: place
                                };

                                _this.tabsViewModel.title('Local Events');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getEventsDataList, _this.renderView);
                                break;

                            case 'weather':

                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'weatherView',
                                    viewModelVariable: 'weatherListViewModel',
                                    viewModelConstructor: WeatherListViewModel,
                                    template: tpl.get('weather-view'),
                                    el: '#weather-view',
                                    place: place
                                };

                                _this.tabsViewModel.title('Local Weather');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getCurrentWeather, _this.renderView);
                                break;

                            case 'restaurants':



                                // Creating an object literal containing the necessary data to later (after receiving a data response) render
                                // the view corresponding to the data returned.
                                viewConfigData = {
                                    viewVariable: 'restaurantsView',
                                    viewModelVariable: 'restaurantsListViewModel',
                                    viewModelConstructor: RestaurantsListViewModel,
                                    template: tpl.get('restaurants-view'),
                                    el: '#restaurants-view',
                                    place: place
                                };

                                _this.tabsViewModel.title('Local Restaurants');

                                // Calling the queryCache function to first check if the requested data has been cached, passing in 2 functions,
                                // the first one will be called if no data was found in the cache.  The second function will be called when data
                                // becomes available, either by retriving it from the cache or receiving a response from a AJAX request.
                                _this.dataController.queryCache(viewConfigData, _this.dataController.getRestaurantsList, _this.renderView);
                                break;
                        }
                    });
            };




            /**
             * A function to remove the current tab view, create a new tab viewModel and render the newly created viewModels html template.
             * @param {array} data - The data result received from the data request to be rendered in the view.
             * @param {object} vcd - The view configuration data containing the data required for rendering the view.
             * @param {boolean} isError - A boolean value indicating if this function is being called as a result of an error.
             */
            this.renderView = function(data, vcd, isError) {

                // Calling custom function to remove the currently rendered Tab view.
                _this.removeCurrentTab();

                // Creating the new view model from vcd (viewConfigData) parameter.
                _this[vcd.viewModelVariable] = new vcd.viewModelConstructor(vcd.place, data, isError, _this);

                // Checking if the element has bindings applied. If no bindings have previously been applied to this element then apply bindings. 
                if (!!!ko.dataFor($('#tab-container')[0])) {
                    ko.applyBindings(_this[vcd.viewModelVariable], $('#tab-container')[0]);
                }

                // Setting the html template of the newly created viewModel 
                _this[vcd.viewModelVariable].template(vcd.template);

                // Removing the KO bindings once the template has been rendered.
                ko.cleanNode($('#tab-container')[0]);

                // Applying the bindings to the newly rendered html template.
                ko.applyBindings(_this[vcd.viewModelVariable], $(vcd.el)[0]);

                // Creating a object literal containing the currently active viewModel and currently visible element.
                // Need this reference when removing the view.
                _this.currentTab = { tab: $(vcd.el)[0], viewModel: _this[vcd.viewModelVariable] };
            };




            /**
             * 
             * 
             */
            this.renderSpinner = function() {

                requirejs(
                    [
                        'spinner_view_model'
                    ],
                    function(
                        SpinnerViewModel
                    ) {

                        viewConfigData = {
                            viewVariable: 'spinnerView',
                            viewModelVariable: 'spinnerViewModel',
                            viewModelConstructor: SpinnerViewModel,
                            template: tpl.get('spinner-view'),
                            el: '#spinner-view',
                            place: null
                        };

                        //
                        _this.renderView(null, viewConfigData, false);
                    });
            };




            /**
             * 
             * 
             */
            this.removeCurrentTab = function() {
                if (_this.currentTab) {
                    ko.removeNode(_this.currentTab.tab);
                    _this.currentTab = null;
                }
            };




            /**
             * 
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             * @param {object} loc - 
             */
            this.setMapVisibility = function(state, loc) {
                if (_this.map.mapViewModel) {
                    _this.map.mapViewModel.showMap(state);
                    if (loc) {
                        _this.map.refreshMap(loc);
                    }
                }
            };




            /**
             * 
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             * @param {boolean} remove - 
             * @param {object} place - 
             */
            this.setTabsVisibility = function(state, remove, place) {
                if (_this.tabsViewModel) {
                    if (place) {
                        _this.tabsViewModel.place(place);
                    }
                    if (remove) {
                        _this.removeCurrentTab();
                    }
                    _this.tabsViewModel.showTabs(state);
                }
            };




            /**
             * A common function to set the visibility of the errorViewModel's data-bound element.
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             */
            this.setErrorVisibility = function(state) {

                // Checking if the view model exists
                if (_this.errorViewModel) {

                    // If it does exist, set the data-bound element 
                    _this.errorViewModel.showError(state);
                }
            };




            /**
             * 
             * 
             */
            this.renderErrorView = function() {
                _this.renderDrawerListView();
                _this.setMapVisibility(HIDDEN);
                _this.setTabsVisibility(HIDDEN, null, true);
                if (_this.errorViewModel) {
                    _this.setErrorVisibility(VISIBLE);
                } else {
                    _this.createErrorView();
                }
            };




            /**
             * 
             * 
             */
            this.createErrorView = function() {

                requirejs(
                    [
                        'error404_view_model',
                        'css!css/error404-view.css'
                    ],
                    function(
                        ErrorViewModel
                    ) {
                        //
                        _this.errorViewModel = new ErrorViewModel();

                        ko.applyBindings(_this.errorViewModel, $('#error-container-view')[0]);

                        _this.errorViewModel.template(tpl.get('error404-view'));

                        ko.cleanNode($('#error-container-view')[0]);

                        ko.applyBindings(_this.errorViewModel, $('#error-view')[0]);
                    });
            };
        };

        //
        return new Main();
    });