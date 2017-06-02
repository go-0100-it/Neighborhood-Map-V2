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
         * Nearly every function of the application is controlled or delegated via this main controller object.  The purpose of the main controller is to be 
         * the hub in which all other modules can communicate through and in which all of the main functionality of the application is generated.  Having this 
         * main controller helps to keep concerns seperate and helps keep code modulal and improve maintainability.  
         * @return {object} - returns a new main controller object.
         */
        var Main = function() {

            // Getting a reference to this execution context for later reference.
            var _this = this;
            let VISIBLE = true;
            let HIDDEN = false;

            // Creating a new Data controller object.
            _this.dataController = new DataController();



            /**
             * A function to create, if not yet created, a new DrawerListViewModel, fetch the Drawer list data and render the Drawer List View html
             * template and returned Drawer list data to the UI.
             * @param {object} place - the place object to derive the location from to pass to the map view (to center the map on the place coordinates).
             */
            this.renderDrawerListView = function(place) {

                // if a place has been passed in set the loc value to the places coordinates.
                var loc = place ? { lat: Number(place.lat), lng: Number(place.lng) } : null;

                // if the drawerListViewModel has not been created previously.
                if (!_this.drawerListViewModel) {

                    // Create a new DrawerListViewModel.
                    _this.drawerListViewModel = new DrawerListViewModel();
                    
                    // Apply the KO bindings between the newly created view model and the existing view container.
                    ko.applyBindings(_this.drawerListViewModel, $('#nav')[0]);

                    // Add the drawer list view html template(view) to the view model which will render in the UI.
                    _this.drawerListViewModel.template(tpl.get('drawer-list-view'));

                    // remove the bindings from the container, so we can add bindings to the added template later.
                    ko.cleanNode($('#nav')[0]);

                    // Creating the LocationRequest object.
                    var LocationRequest = {};

                    // Calling the renderMap function to render the map if it has not already been rendered or make it visible if it 
                    // has already been rendered.
                    _this.renderMap(loc);

                    // if a loc has been set then create a locationRequest object to pass to the initAuth function to be calledback once the data
                    // has request has been returned, which will then center the map on the location.
                    if (loc) {
                        // creating a object literal with the necessary data and function to center the map on the location at a later time.
                        LocationRequest = { centerOnLocation: _this.map.centerOnLocation, centerRequested: true, locRequested: loc };
                    }

                    // Calling the initAuth function to log the user in to the firebase database Anonymously.  Passing in the callbacks to be called 
                    // once the user has been logged in.
                    FBHelper.initAuth(_this.dataController.getUserPlaces, _this.drawerListViewModel.pushPlace, LocationRequest);




                    /**
                     * A function to delegate the adding of a new place object to the dataController.
                     * @param {object} place - the new place object to add to firebase
                     */
                    _this.drawerListViewModel.updatePlacesData = function(place) {

                        // calling the dataControllers updateUserPlaces function to update the firebase database with the new place object.
                        _this.dataController.updateUserPlaces(place, FBHelper.uid);
                    };




                    /**
                     * A function to delegate the removal of a place object to the dataController.
                     * @param {object} place - the place object to remove from the firebase database.
                     */
                    _this.drawerListViewModel.removePlaceData = function(place) {

                        // calling the dataControllers removeUserPlace function to remove the place object from the firebase database.
                        _this.dataController.removeUserPlace(place, FBHelper.uid);
                    };

                    // applying KO bindings to the drawerListViewModel and the drawer view.
                    ko.applyBindings(_this.drawerListViewModel, $('#drawer-menu-container')[0]);

                    // if the drawerListViewModel has already been rendered.
                } else {

                    // render the map, this function will either create a new map if one has not already been created or show the map if
                    // it is hidden.
                    _this.renderMap(loc);
                }
            };




            /**
             * A function to either show the already created map or create one if one is not already created and to hide the other views
             * to allow for a full screen map.
             * @param {object} place - the place object to center the map on once it is either shown or created.
             */
            this.renderMap = function(place) {

                // Calling the setTabsVisibility function to set the tabs views visibility to HIDDEN.
                _this.setTabsVisibility(HIDDEN, true);

                // // Calling the setErrorVisibility function to set the error views visibility to HIDDEN.
                _this.setErrorVisibility(HIDDEN);
                
                // if the maps has aready been created then set the visibility to VISIBLE.
                if (_this.map) {

                    // Calling the setMapVisibility function to set the maps views visibility to VISIBLE.
                    _this.setMapVisibility(VISIBLE, loc);

                    // create a new map if one has not been created.
                } else {

                    // Calling the createMap function to create a new Map.
                    _this.createMap(loc);
                }
            };




            /**
             * A function to create a new Map object and store reference to this new Map object in this MainController module and the drawerListViewModel
             * module.
             * @param {object} loc - .
             */
            this.createMap = function(loc) {

                // creating a new Map object
                _this.map = new Map();

                // initializing the new Map.
                _this.map.init();

                // giving reference to the map object to the drawerListViewModel.
                _this.drawerListViewModel.map = _this.map;

                // Checking if the users browser has geolocation.
                if (navigator.geolocation) {

                    // getting users current location via geolocation.
                    navigator.geolocation.getCurrentPosition(function(position) {

                        // creating a default location object, if a loc value exists use that else use the users location coordinates.
                        var defaultLoc = loc ? loc : {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        // calling the maps centerOnLocation function to center the map 
                        _this.map.centerOnLocation(defaultLoc);
                    });
                }
            };




            /**
             * A function to create a new tabs view if one was not already created or show the previously created but hidden tabs view then
             * render the tab view.
             * @param {object} place - the place object to render in the tabs view.
             * @param {object} view - the type of tab view requested to be rendered for the tabs view.  
             */
            this.renderTabsView = function(place, view) {

                // calling the renderDrawerListView to render the drawer and map if it has not already been rendered.
                _this.renderDrawerListView(place);

                // hide the map view if it is visible.
                _this.setMapVisibility(HIDDEN);

                // hide the error view if it is visible.
                _this.setErrorVisibility(HIDDEN);

                // if the tabsViewModel exists.
                if (_this.tabsViewModel) {

                    // show the tabs view and update the place to display.
                    _this.setTabsVisibility(VISIBLE, null, place);

                    // if the tabsViewModel does not exist
                } else {

                    // create the tabs view.
                    _this.createTabsView(place);
                }

                // render the spinner to show while we wait for the data request response.
                _this.renderSpinner();

                // calling the renderTabView function to render the requested tab, will also fetch the corresponding data.
                _this.renderTabView(place, view);
            };




            /**
             * 
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

                        //
                        ko.applyBindings(_this.tabsViewModel, $('#tabs-container-view')[0]);

                        //
                        _this.tabsViewModel.template(tpl.get('tabs-view'));

                        //
                        ko.cleanNode($('#tabs-container-view')[0]);

                        //
                        ko.applyBindings(_this.tabsViewModel, $('#tabs-view')[0]);
                    });
            };



            /**
             * A function to initialize the rendering of a tab view. Creates view config data and initializes the data requests.
             * @param {object} place - the place object (location) for which the data is being requested.
             * @param {string} view - the type of view needed to display the requested data.
             */
            this.renderTabView = function(place, view) {

                // requiring the view model modules and css required for the views.
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
             */
            this.renderSpinner = function() {

                // requiring the view model module required for the view.
                requirejs(
                    [
                        'spinner_view_model'
                    ],
                    function(
                        SpinnerViewModel
                    ) {

                        // Creating an object literal containing the necessary data used to render the view.
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

                //
                if (_this.currentTab) {

                    //
                    ko.removeNode(_this.currentTab.tab);

                    //
                    _this.currentTab = null;
                }
            };




            /**
             * 
             * @param {boolean} state - the boolean value indicating the visibility state requested.  True for visible, false for hidden.
             * @param {object} loc - 
             */
            this.setMapVisibility = function(state, loc) {

                //
                if (_this.map.mapViewModel) {

                    //
                    _this.map.mapViewModel.showMap(state);

                    //
                    if (loc) {

                        //
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
             * A function to create an error view if one does not already exist or show the previously created hidden view.
             */
            this.renderErrorView = function() {

                //
                _this.renderDrawerListView();

                //
                _this.setMapVisibility(HIDDEN);

                //
                _this.setTabsVisibility(HIDDEN, null, true);

                //
                if (_this.errorViewModel) {

                    //
                    _this.setErrorVisibility(VISIBLE);

                //
            } else {
                
                    //
                    _this.createErrorView();
                }
            };




            /**
             * A function to create an errorViewModel and render the error html template.  This error view is displayed when
             * the requested URL is not found.
             */
            this.createErrorView = function() {

                // requiring the view model module and css required for the view.
                requirejs(
                    [
                        'error404_view_model',
                        'css!css/error404-view.css'
                    ],
                    function(
                        ErrorViewModel
                    ) {
                        // creating the errorViewModel to render the error html template.
                        _this.errorViewModel = new ErrorViewModel();

                        // applyiung the bindings to the view model and the dom element.
                        ko.applyBindings(_this.errorViewModel, $('#error-container-view')[0]);

                        // updating the viewModel template to render the html.
                        _this.errorViewModel.template(tpl.get('error404-view'));

                        // removing the bindings from the container view.
                        ko.cleanNode($('#error-container-view')[0]);

                        // applying new bindings to the view models newly updated html template.
                        ko.applyBindings(_this.errorViewModel, $('#error-view')[0]);
                    });
            };
        };

        // retruning a new Main object.
        return new Main();
    });