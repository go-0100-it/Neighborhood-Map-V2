/**
 * Using Require.js to define a module responsible for...
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

        //
        var Router = Backbone.Router.extend({

            // Constructor
            initialize: function() {

                //Required for Backbone to start listening to hashchange events
                Backbone.history.start();
            },

            routes: {

                // Calls the home method when there is no hashtag on the url
                '': 'placesOnMap',
                'places/:id/:name/:address/:lat/:lng': 'placeOnMap',
                'events/:id/:name/:address/:lat/:lng': 'events',
                'weather/:id/:name/:address/:lat/:lng': 'weather',
                'restaurants/:id/:name/:address/:lat/:lng': 'restaurants',
                '*path': 'error404'
            },




            /**
             * 
             */
            'placesOnMap': function() {

                // Calling function @ Maincontroller to create the drawerListView
                MainController.renderDrawerListView();
            },




            /**
             * 
             */
            'placeOnMap': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling function @ Maincontroller to create the drawerListView, passing the place object to center the map.
                MainController.renderDrawerListView(place);
            },




            /**
             * 
             */
            'events': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'events');
            },




            /**
             * 
             */
            'weather': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'weather');
            },




            /**
             * 
             */
            'restaurants': function(id, name, address, lat, lng) {

                // Creating a place object from the url parameters to pass to the render function.
                var place = { id: id, name: name, address: address, lat: lat, lng: lng };

                // Calling the renderTabsView function @ Maincontroller to create the Tabs view, passing in the view type as a string and the
                // place object to the render function to later determine the data request and tab view required.
                MainController.renderTabsView(place, 'restaurants');
            },




            /**
             * 
             */
            'error404': function() {

                // Calling the renderErrorView function @ Maincontroller to create the Error view, passing in the view type as a string
                // to the render function to determine tab view required.
                MainController.renderErrorView('error404');
            }
        });

        //
        return Router;
    });