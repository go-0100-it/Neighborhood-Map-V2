/**
 * Using Require.js to define a module responsible for initializing the app
 */
define(
    [
        'router'
    ],
    function(
        Router
    ) {
        // returning the one function of this module, the initialize function, which initializes the app by creating
        // a backbone router.
        return {

            initialize: function() {

                // creating a new backbone router
                var router = new Router();
            },
        };
    });