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
         * @constructor - A function constructor to create a KO view model for the spinner view. This view model is responsible for all the functions 
         * related to the corresponding events view and creates a two way data binding between the view and the view model for simplifying DOM manipulation.
         * this view is rendered to the UI during data requests and is removed once the data ready to be rendered.
         */
        var SpinnerViewModel = function() {

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // returning the SpinnerViewModel
            return this;
        };

        // returning the SpinnerViewModel's constructor
        return SpinnerViewModel;
    });