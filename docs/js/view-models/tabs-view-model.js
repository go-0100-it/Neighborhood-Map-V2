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
         * @constructor - A function constructor to create a KO view model for the tabs view. This view model is responsible for all the functions 
         * related to the corresponding tabs view and creates a two way data binding between the view and the view model for simplifying DOM manipulation.
         * @param {object} place - the place object to render this tabs view for.
         */
        var TabsViewModel = function(place) {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showTabs = ko.observable(true);

            // an array of strings of the different view types.
            this.tabsList = ['events', 'weather', 'restaurants'];

            // the place object that additional data has been requested for.
            this.place = ko.observable(place);

            // reference to the place's id.
            this.id = ko.observable(this.place().id);

            // reference to the place's name.
            this.name = ko.observable(this.place().name);

            // an observable for the title of the tabs view, this will change as the view type requested changes.
            this.title = ko.observable('');

            // reference to the place's address.
            this.address = ko.observable(this.place().address);

            // reference to the place's latitude
            this.lat = ko.observable(this.place().lat);

            // reference to the place's longitude.
            this.lng = ko.observable(this.place().lng);

            // an observable to keep track of the views expanded state
            this.expanded = ko.observable(false);

            // an observable to add or remove the "responsive" css class
            this.expandedClass = ko.observable('');




            /**
             * A function to toggle the tabs view menu. This function simply updates the expandedClass observable which inturn adds or
             * removes the "responsive" class and updates the expanded observable with the corresponding state.
             */
            this.toggleTabsMenu = function() {

                // if the tabs menu is expanded
                if (_this.expanded()) {

                    // remove the "responsive" class attribute to colapse the tabs menu
                    _this.expandedClass('');

                    // if the tabs menu is not expanded
                } else {

                    // add the "responsive" class attribute to expand the tabs menu
                    _this.expandedClass('responsive');
                }

                // negate the state
                _this.expanded(!_this.expanded());
            };




            /**
             * Subscribing to the place observables change event.  The function will be calledback every time the place
             * observable changes.  Using to put date the view with the new place details.
             */
            this.place.subscribe(function() {

                // updating the id with the new place id
                _this.id(_this.place().id);

                // updating the name with the new place name
                _this.name(_this.place().name);

                // updating the address with the new place address
                _this.address(_this.place().address);

                // updating the latitude with the new place latitude
                _this.lat(_this.place().lat);

                // updating the longitude with the new place longitude
                _this.lng(_this.place().lng);
            });




            /**
             * A function to navigate to the tab view corresponding the the tab clicked by calling the navigateTab function and passing in the
             * tab type.
             */
            this.onClickWeatherTab = function() {
                _this.navigateTab(_this.tabsList[1]);
            };




            /**
             * A function to navigate to the tab view corresponding the the tab clicked by calling the navigateTab function and passing in the
             * tab type.
             */
            this.onClickRestaurantsTab = function() {
                _this.navigateTab(_this.tabsList[2]);
            };




            /**
             * A function to navigate to the tab view corresponding the the tab clicked by calling the navigateTab function and passing in the
             * tab type.
             */
            this.onClickEventsTab = function() {
                _this.navigateTab(_this.tabsList[0]);
            };




            /**
             * A function to navigate to the map view on button click
             */
            this.onClickMapIcon = function() {
                Backbone.history.navigate('#places/' + _this.id() + '/' + _this.name() + '/' + _this.address() + '/' + _this.lat() + '/' + _this.lng(), { trigger: true });
            };




            /**
             * A common function to navigate to a tab view.
             * @param {string} tab - a string to identify the tab type to navigate to
             */
            this.navigateTab = function(tab) {

                // closing the tabs menu (if open)
                _this.toggleTabsMenu();
                Backbone.history.navigate('#' + tab + '/' + _this.id() + '/' + _this.name() + '/' + _this.address() + '/' + _this.lat() + '/' + _this.lng(), { trigger: true });
            };

            // returning the TabsViewModel
            return this;
        };

        // returning the TabsViewModel's constructor
        return TabsViewModel;
    });