/**
 * Using Require.js to define a module responsible for creating a require configuration object and initializing the app.
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
        /* Library modules*/
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore.min',
        backbone: 'libs/backbone.min',
        knockout: 'libs/knockout.min',
        app: 'app',
        util: 'util',
        events_API: ['libs/eventful-api-interface',
            'https://api.eventful.com/js/api'
        ],

        /*Firebase modules*/
        firebase_app: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-app',
        firebase_auth: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-auth',
        firebase_data: 'https://www.gstatic.com/firebasejs/3.9.0/firebase-database',
        firebase_helper: 'controllers/firebase-helper',

        /*Controller modules*/
        main_controller: 'controllers/main-controller',
        map_controller: 'controllers/map-controller',
        data_controller: 'controllers/data-controller',
        cache: 'controllers/cache',

        /*ViewsModel modules*/
        drawer_list_view_model: 'view-models/drawer-list-view-model',
        tabs_view_model: 'view-models/tabs-view-model',
        events_list_view_model: 'view-models/events-list-view-model',
        weather_list_view_model: 'view-models/weather-list-view-model',
        restaurants_list_view_model: 'view-models/restaurants-list-view-model',
        map_view_model: 'view-models/map-view-model',
        info_window_view_model: 'view-models/info-window-view-model',
        spinner_view_model: 'view-models/spinner-view-model',
        error404_view_model: 'view-models/error404-view-model'
    }
});
// requiring all the base modules needed
requirejs(
    [
        'jquery',
        'underscore',
        'backbone',
        'knockout',
        'util',
        'firebase_app'
    ],
    function(
        $,
        _,
        bb,
        ko,
        tpl
    ) {

        // loading the html templates via the util module
        tpl.loadTemplates(
            [
                'drawer-list-view',
                'map',
                'tabs-view',
                'events-view',
                'weather-view',
                'restaurants-view',
                'spinner-view',
                'error404-view'
            ],
            function() {

                // requiring the necessary firebase modules as well as the base css required.
                requirejs(
                    [
                        'firebase_auth',
                        'firebase_data',
                        'css!css/navbar-view.css',
                        'css!css/map.css',
                        'css!css/main-view.css',
                        'css!css/drawer-menu.css'
                    ],
                    function() {

                        // Initializing Firebase
                        var configFB = {
                            apiKey: "AIzaSyAlFaHJIu2go9re03lp6AaunDBfuI9GkCk",
                            authDomain: "neighbourhoodmap-1491157111381.firebaseapp.com",
                            databaseURL: "https://neighbourhoodmap-1491157111381.firebaseio.com",
                            projectId: "neighbourhoodmap-1491157111381",
                            storageBucket: "neighbourhoodmap-1491157111381.appspot.com",
                            messagingSenderId: "139908232326"
                        };
                        firebase.initializeApp(configFB);
                        // requiring the app module to initialize the app
                        requirejs(
                            [
                                'app'
                            ],
                            function(
                                app
                            ) {
                                // initializing the app
                                app.initialize();
                            });
                    });
            });
    });