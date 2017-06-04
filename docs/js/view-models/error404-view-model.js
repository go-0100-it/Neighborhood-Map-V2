/**
 * Using Require.js to define a module responsible for a functions relating to the error view.
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
         * @constructor - a function constructor to create a KO view model responsible for all the functions relating to 
         * and interacting with the error view.
         */
        var ErrorViewModel = function() {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            // creating an obsevable for the views html template
            this.template = ko.observable();

            // creating a observable to toggle the view state, setting the default to true(visible)
            this.showError = ko.observable(true);




            /**
             * A function to navigate to the apps main page via button click
             */
            this.onClick = function() {
                alert("Main Page clicked");
            };

            // returning the ErrorViewModel
            return this;
        };

        // returning the ErrorViewModel constructor
        return ErrorViewModel;
    });