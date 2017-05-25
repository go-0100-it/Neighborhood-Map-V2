/**
 * Using Require.js to define a module responsible for...
 */
define([
        'jquery',
        'backbone',
        'underscore',
        'knockout',
        'main_controller'
    ],
    function($, Backbone, _, ko, MainController) {
        var WeatherListViewModel = function(place, data, isError, main) {
            var _this = this;
            var Main = main;
            this.data = data.data;
            this.currentCond = _this.data.current_condition[0];
            this.weather = _this.data.weather[0];
            this.iconSrc = ko.observable(_this.currentCond.weatherIconUrl[0].value);
            this.weatherDesc = ko.observable(_this.currentCond.weatherDesc[0].value);
            this.currentTemp = ko.observable(_this.currentCond.temp_C);
            this.lowTemp = ko.observable(_this.weather.mintempC);
            this.highTemp = ko.observable(_this.weather.maxtempC);
            this.isErr = ko.observable(isError);
            this.get5day = function() {
                alert('Getting 5 day');
            };
            console.log(_this.data);
            return this;
        };
        return WeatherListViewModel;
    });