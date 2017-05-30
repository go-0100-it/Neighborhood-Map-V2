/**
 * Using Require.js to define a module responsible for...
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
        var ErrorViewModel = function() {

            //
            var _this = this;

            //
            this.template = ko.observable();

            //
            this.showError = ko.observable(true);




            /**
             * 
             */
            this.onClick = function() {
                alert("Main Page clicked");
            };

            //
            return this;
        };
        return ErrorViewModel;
    });