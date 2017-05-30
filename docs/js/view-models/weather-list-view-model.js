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
        var WeatherListViewModel = function(place, data, isError, main) {

            //
            var _this = this;

            //
            this.template = ko.observable();

            //
            this.showTab = ko.observable(true);

            //
            var Main = main;

            //
            this.data = data.data;

            //
            this.currentCond = _this.data.current_condition[0];

            //
            this.weather = _this.data.weather[0];

            //
            this.iconSrc = ko.observable(_this.currentCond.weatherIconUrl[0].value);

            //
            this.weatherDesc = ko.observable(_this.currentCond.weatherDesc[0].value);

            //
            this.currentTemp = ko.observable(_this.currentCond.temp_C);

            //
            this.lowTemp = ko.observable(_this.weather.mintempC);

            //
            this.highTemp = ko.observable(_this.weather.maxtempC);

            //
            this.isErr = ko.observable(isError);




            /**
             * 
             */
            this.get5day = function() {
                alert('Getting 5 day');
            };

            //
            return this;
        };

        //
        return WeatherListViewModel;
    });