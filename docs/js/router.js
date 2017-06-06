/**
 * Using Require.js to define a module responsible for creating a backbone router
 */
define(
    [
        'jquery',
        'main_controller'
    ],
    function(
        $,
        MainController
    ) {

        // creating a Backbone router
        var Router = Backbone.Router.extend({

            initialize: function() {

                //Required for Backbone to start listening to hashchange events
                Backbone.history.start();
            },

            routes: {

                // Calls the placesOnMap method when there is no hashtag in the url
                '': 'placesOnMap',
                'places/:id/:name/:address/:lat/:lng': 'placeOnMap',
                'events/:id/:name/:address/:lat/:lng': 'events',
                'weather/:id/:name/:address/:lat/:lng': 'weather',
                'restaurants/:id/:name/:address/:lat/:lng': 'restaurants',
                '*path': 'error404' // (default) this path is called for all other urls
            },




            /**
             * A function to render the drawer list and the map without a selected place
             */
            'placesOnMap': function() {

                // Calling function @ Maincontroller to create the drawerListView
                MainController.renderDrawerListView();
            },




            /**
             * A function to render the drawer list and the map with a selected place
             */
            'placeOnMap': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling function @ Maincontroller to create the drawerListView, passing the place object to center the map.
                MainController.renderDrawerListView(place);
            },




            /**
             * A function to render tabs view with the events view for a given place
             */
            'events': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'events');
            },




            /**
             * A function to render tabs view with the weather view for a given place
             */
            'weather': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'weather');
            },




            /**
             * A function to render tabs view with the restaurants view for a given place
             */
            'restaurants': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'restaurants');
            },




            /**
             * A function to render the 404 error view for page not found
             */
            'error404': function() {

                // Calling the renderErrorView function @ Maincontroller to create the Error view, passing in the view type as a string
                // to the render function to determine tab view required.
                MainController.renderErrorView('error404');
            }
        });

        // returning the router
        return Router;
    });