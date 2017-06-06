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
         * @constructor - A function constructor to create a KO view model for the weather list view. This view model is responsible for all the functions 
         * related to the corresponding events view and creates a two way data binding between the view and the view model for simplifying DOM manipulation.
         * @param {object} place - the place object to fetch the local weather for.
         * @param {array} data - the data response from the worldweatheronline API request. 
         * @param {boolean} isError - a boolean value indicating if the data request to the worldweatheronline API resulted in an error.
         * @param {object} main - a reference to the main controller object.
         */
        var WeatherListViewModel = function(place, data, isError, main) {

            // Getting a reference to this execution context for later reference.
            var _this = this;

            // creating a template observable to render the views html.
            this.template = ko.observable();

            // creating an observable to toggle the views state, true for visible and false for hidden.
            this.showTab = ko.observable(true);

            // keeping reference to the main controller object
            var Main = main;

            // keeping reference to the data returned from the request.
            this.data = data.data;

            // getting the current condition data from the data
            this.currentCond = _this.data.current_condition[0];

            // getting the weather data from the data
            this.weather = _this.data.weather[0];

            // getting the icon from the current condition data
            this.iconSrc = ko.observable(_this.currentCond.weatherIconUrl[0].value);

            // getting the weather descrition from the current condition data
            this.weatherDesc = ko.observable(_this.currentCond.weatherDesc[0].value);

            // getting the current tempature from the current condition data
            this.currentTemp = ko.observable(_this.currentCond.temp_C);

            // getting the low tempature from the weather data
            this.lowTemp = ko.observable(_this.weather.mintempC);

            // getting the high tempature from the weather data
            this.highTemp = ko.observable(_this.weather.maxtempC);

            // creating an observable to reference if the request result returned an error.
            this.isErr = ko.observable(isError);




            /**
             * A function for future functionality
             */
            this.get5day = function() {
                alert('The 5 day forcast function is currently unavailable, will be coming soon!');
            };

            //
            return this;
        };

        //
        return WeatherListViewModel;
    });