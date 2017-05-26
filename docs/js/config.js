/**
 * Using Require.js to define a module responsible for...
 */
requirejs.config({
    //By default load any module IDs from js
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        /* Libraries */
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore.min',
        backbone: 'libs/backbone.min',
        knockout: 'libs/knockout.min',
        app: 'app',
        util: 'util',
        events_API: ['libs/eventful-api-interface',
            'https://api.eventful.com/js/api'
        ],

        /*Firebase*/
        firebase_app: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-app',
        firebase_auth: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-auth',
        firebase_data: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-database',
        firebase_helper: 'controllers/firebase-helper',

        /*Controllers*/
        main_controller: 'controllers/main-controller',
        map_controller: 'controllers/map-controller',
        data_controller: 'controllers/data-controller',
        cache: 'controllers/cache',

        /*ViewsModels*/
        drawer_list_view_model: 'view-models/drawer-list-view-model',
        tabs_view_model: 'view-models/tabs-view-model',
        events_list_view_model: 'view-models/events-list-view-model',
        weather_list_view_model: 'view-models/weather-list-view-model',
        restaurants_list_view_model: 'view-models/restaurants-list-view-model',
        others_list_view_model: 'view-models/others-list-view-model',
        map_view_model: 'view-models/map-view-model'
    },
});
// Start the main app logic.
requirejs([
    'jquery',
    'underscore',
    'backbone',
    'knockout',
    'util',
    'firebase_app'

], function($, _, bb, ko, tpl) {
    tpl.loadTemplates(['drawer-list-view', 'map', 'tabs-view', 'events-view', 'weather-view', 'restaurants-view', 'others-view', 'tabs-spinner-view'], function() {
        // Start the main app logic.
        requirejs(['firebase_auth', 'firebase_data'], function() {
            // Initialize Firebase
            var configFB = {
                apiKey: "AIzaSyAlFaHJIu2go9re03lp6AaunDBfuI9GkCk",
                authDomain: "neighbourhoodmap-1491157111381.firebaseapp.com",
                databaseURL: "https://neighbourhoodmap-1491157111381.firebaseio.com",
                projectId: "neighbourhoodmap-1491157111381",
                storageBucket: "neighbourhoodmap-1491157111381.appspot.com",
                messagingSenderId: "139908232326"
            };
            firebase.initializeApp(configFB);
            requirejs(['app'], function(app) {
                app.initialize();
            });
        });
    });
});