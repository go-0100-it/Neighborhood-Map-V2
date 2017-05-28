/**
 * Using Require.js to define a module responsible for creating a Data Controller object and defining the modules required by this module.
 */
define([
        'jquery',
        'knockout',
        'events_API',
        'cache',
        'firebase_app',
        'firebase_auth',
        'firebase_data'
    ],
    function(
        $,
        backbone,
        EventsApi,
        Cache
    ) {


        /**
         * @constructor - Creates a Data controller object.
         * This controller is responsible for retrieving all external data required by the app.  This Controller queries the apps firebase database 
         * for drawers list of places, as well as other third party API calls used to render the tabs view.
         * The controller constructor could be called from any module but, for sake of clenliness, is only created once in the main controller and 
         * referenced only in the main controller.
         * @return - returns the DataController constructor.
         */
        var DataController = function() {
            var _this = this;
            let DONE = 4;
            let OK = 200;
            let ERROR = 400;
            let ERR_MSG = 'Something went wrong while processing the data request.';
            let TIMEOUT_MSG = 'A timeout has occurred./nThe server took to long to respond, the request has been aborted.';

            // This variable is used by the callbackSync function.  Used to keep count of the data requests made by the user.
            this.dataRequestCount = 0;

            // The API key supplied by http://api.eventful.com/ and is required to access the Eventful API.
            this.eventsApiKey = '2J8Xh6BQhcPvkQCd';

            // The API key supplied by https://developers.zomato.com and is required to access the Zomato API.
            this.restaurantsApiKey = 'de81b40aeca20309296e437c5914de3d';

            // The API key supplied by https://worldweatheronline.com and is required to access the World Weather Online API.
            this.weatherApiKey = 'e699f514c84a4a1c98f84105171005';


            /**
             * I was unable to find a way to cancel the previously made AJAX requests upon making another so I came up with this work around were the previous requests
             * are simply ignored.  The request would not be completely wasted as the result would be cached and therefor, this seemed like a viable solution to me.
             * Using this function to call only the render function associated with the most recent data requested by the user.  If the user has previously requested data and 
             * commits to subsequent data requests before the previous data has been processed and rendered, then only the last data request will be processed and rendered.
             * @param {object} data - The data being passed to the callback function.
             * @param {string} callbackId - The id of the requested callback(the dataRequestCount value captured when the request was made).
             * @param {array} args - The array of args being passed to the callback function.
             * @param {function} func - The callback function.
             */
            this.callbackSync = function(data, callbackId, args, func, isError) {

                // Checking if the callbackId matches the current data request count, if it does then it's the most recent, then call the function passed in (The render tabs view function)
                if (callbackId === _this.dataRequestCount) {
                    func(data, args, isError);
                }
            };

            /**
             * A function to query the application cache prior to HTTP requests and then, depending on the results, call the appropriate callback function. 
             * This function checks if data from a previous request with the same stamp(requestId) is currently stored in the cache.  If data exists, 
             * retrieve the data and call the callbackSync function. If no data exists, initiate the HTTP request by calling the first callback function (func1).
             * @param {object} args - is an object to define the view and view model to be created, it will be passed to the second callback function(func2)
             * when calling it.
             * @param {function} func1 - the callback function to be called if no data with the same stamp(requestId) exists in the cache.
             * @param {function} func2 - the callback function to be passed to either the callbackSync function, if data exists, or the first callback 
             * function(func1), if no data exists. This function(func2) will create the view and view model necessary to display the data to the user.
             */
            this.queryCache = function(args, func1, func2) {

                // Calling the clearStale function on the Cache to remove all the expired data stored before querying the Cache.
                Cache.clearStale();

                // Querying the Cache for the current request.
                var stamp = args.viewVariable + args.place.id;

                // If the a request stamp is found that matches the current one then continue with the users request but using the Cached data
                // instead of doing a HTTP get request.
                if (Cache.has(stamp)) {

                    // Incrementing the dataRequestCount variable by 1 every time a request is made(this code is run).
                    _this.dataRequestCount += 1;

                    // Capturing the current dataRequestCount value as this requests id.
                    var callId = _this.dataRequestCount;

                    // Getting the Cached data with the stamp that matches the current stamp.
                    var data = Cache.getCachedData(stamp);

                    // Calling callbackSync function to check if this is the most recent request made by the user.
                    _this.callbackSync(data, callId, args, func2, false);

                    // as there is no data stored, call the callback function(func1) which will initiate the HTTP request to fetch the data.  Passing in the 
                    // second callback function and args to create the required view to display the requested data.
                } else {
                    func1(args, func2);
                }
            };




            /**
             * A function to query the evenful API.  Stores the returned data in the application cache and calls the callback function to render the view.
             * This is not a typical HTTP request but contains the method supplied by evenful to interact with their API.
             * @param {object} args - is an object to define the view and view model to be created, it will be passed to the callback function(func)
             * when calling it.
             * @param {function} func - the callback function to be passed to the callbackSync function after the request has been processed.  This 
             * function will create the view and view model necessary to display the data, returned by the HTTP request, to the user.
             */
            this.getEventsDataList = function(args, func) {

                _this.eventsTimeOut = window.setInterval(function() {
                    window.clearInterval(_this.eventsTimeOut);
                    var err = { msg: TIMEOUT_MSG, type: 'ERROR: Timeout' };
                    _this.processError(err, { events: { event: [{ title: err.msg, image: null, start_time: '', venue_url: '', venue_address: '' }] } }, callId, args, func);
                }, 20000);

                // Incrementing the dataRequestCount variable by 1 every time a request is made(this code is run).
                _this.dataRequestCount += 1;

                // Capturing the current dataRequestCount value as this requests id.
                var callId = _this.dataRequestCount;

                // Formatting the geo-coords for the API request's where value.
                var where = args.place.lat + ',' + args.place.lng;

                // Creating an obj literal to pass as the API's request parameters.
                var oArgs = {
                    app_key: _this.eventsApiKey,
                    q: "events",
                    where: where,
                    within: 10,
                    "date": _this.getFormattedDate() + '-' + _this.getFormattedDate(1),
                    page_size: 40,
                    sort_order: "date",
                    sort_direction: 'ascending'
                };

                /**
                 * Making the data request call via the EVDB.API.call function(contained in Eventful's api.js file) and 
                 * passing the arguments to filter the search and the callback function to run when the result is ready.
                 */
                EVDB.API.call("/events/search", oArgs, function(oData) {

                    window.clearInterval(_this.eventsTimeOut);

                    var stamp = args.viewVariable + args.place.id;
                    // If there was an event array returned containing events for the API request then assign to the events variable.
                    // If the event array returned was empty then assign a default object to the events variable to inform the user.
                    var data = oData.events.event.length !== 0 ? oData : { events: { event: [{ title: 'No events found for this location', image: null, start_time: '', venue_url: '', venue_address: '' }] } };

                    // Caching the result to reduce the number of Http requests.
                    Cache.storeResult(stamp, 3600000, data);

                    // Calling callbackSync function to check if this is the most recent request made by the user.
                    _this.callbackSync(data, callId, args, func, false);
                });
            };


            /**
             * A function to query the applications firebase database for the anonymous users data.  The query returns an object containing the 
             * users stored places objects, if there are any.  If the request returns a places object, loop through the places object and call the 
             * callback function passed in for each place.  If the request does not return a places object(no places stored) then call the getDefaultPlaces
             * function to rertrieve the default places stored.
             * @param {function} func - the callback function to be called on each place if the firebase request result returns a places object.  Pushes
             * each place to the drawer-list-view-models ko.observableArray(this auto magically adds them to the view).
             * @param {string} uid - the unique id generated by firebase for the current anonymous user.
             * @param {object} request - an object containing the request data, using to center a location in the map view.
             */
            this.getUserPlaces = function(func, uid, request) {

                /**
                 * Querying the firebase database for the places object saved by the anonymous user and passing a callback function to be called once the 
                 * database responds to the request.
                 */
                firebase.database().ref(uid).once('value').then(function(snapshot) {

                    // snapshot is the object returned by firebase containing the data requested.  Assigning the value of snapshot to a variable.
                    var places = snapshot.val();

                    //  If firebase returned a data object then loop through that objects keys(place Ids) and push to the drawer-list-view-nodels
                    // ko.observableArray(this auto magically adds them to the view).
                    if (places) {
                        $.each(places, function(key, value) {
                            func(value);
                        });

                        // If request.centerRequested is true calling the centerOnLocation function and passing the location contained in the request object.
                        if (request.centerRequested) {
                            request.centerOnLocation(request.locRequested);
                        }
                    } else {

                        // If firebase returned no data then call this function to get the defaults list of places stored.
                        _this.getDefaultPlaces(request, func);
                    }

                });
            };




            /**
             * A function to query the firebase database for the list of default places.  To be called only if the anonymous user does not have
             * any places saved to the database. 
             * This function is called only if the anonymous user does not have any places save to the database.
             * @param {object} request - an object containing the request data, using to center a location in the map view.
             * @param {function} func - The callback function to be called in the for each loop after firebase returns the requested data.
             */
            this.getDefaultPlaces = function(request, func) {

                /**
                 * Querying the firebase database for the default places object and passing a callback function to be called once the 
                 * database responds to the request.  This function is only called if the user has not yet created any new places.
                 */
                firebase.database().ref("default").once('value').then(function(snapshot) {

                    // Storing the object returned from firebase to a variable.
                    var places = snapshot.val();

                    if (places) {
                        // Calling the callback function on each key(googles place id) in the object and passing in the value(a place object) to the function.
                        $.each(places, function(key, value) {
                            func(value);
                        });

                        // If request.centerRequested is true calling the centerOnLocation function and passing the location contained in the request object.
                        if (request.centerRequested) {
                            request.centerOnLocation(request.locRequested);
                        }
                    } else {
                        alert('FireBase data request error: ' + ERR_MSG);
                    }
                });
            };




            /**
             * A function to query the Zoopla API for a list of restaurants local to the selected place.  The place data is passed in the args object.
             * @param {object} args - is an object to define the view and view model to be created, it will be passed to the callback function(func)
             * when calling it.
             * @param {function} func - the callback function to be passed to the callbackSync function after the request has been processed.  This 
             * function will create the view and view model necessary to display the data, returned by the HTTP request, to the user.
             */
            this.getRestaurantsList = function(args, func) {

                // Incrementing the dataRequestCount variable by 1 every time a request is made(this code is run).
                _this.dataRequestCount += 1;

                // Capturing the current dataRequestCount value as this requests id.
                var callId = _this.dataRequestCount;

                // Creating a new Http get request.
                var getRequest = new XMLHttpRequest();

                // Setting the callback for the onreadystatechange Event handler which is called when the readystate changes.
                getRequest.onreadystatechange = function() {

                    var restaurants;

                    if (this.readyState == DONE && this.status == OK) {

                        // Parsing the response and setting to a variable for readability.
                        var jsonResponse = JSON.parse(this.response);

                        // Parsing the response and setting to a variable for readability if the array returned has values.  If the array is empty creating a default message
                        // to display inform the user no results were found.
                        restaurants = jsonResponse.restaurants.length !== 0 ? jsonResponse.restaurants : [{ name: 'No restaurants found for this location', cuisine: '', location: { address: '' } }];

                        // Creating a unique label for caching the result
                        var stamp = args.viewVariable + args.place.id;

                        // Caching the result to reduce the number of Http requests.
                        Cache.storeResult(stamp, 3600000, restaurants);

                        // Calling the callbackSync function to check if this is the most recent request made by the user.
                        // Passing the data and the function to call if this is the most recent request.
                        _this.callbackSync(restaurants, callId, args, func, false);

                        // If the response from server is an error, log the error
                    } else if (this.status >= ERROR) {
                        var err = { msg: getRequest.responseText, type: 'ERROR: ' + getRequest.status };
                        _this.processError(err, [{ name: ERR_MSG + ' ' + err.type, cuisine: '', location: { address: '' } }], callId, args, func);
                    }
                };


                getRequest.timeout = 5000;
                getRequest.onerror = function(e) {
                    var err = { msg: ERR_MSG, type: 'PROCESS EVENT: ' + e.type };
                    _this.processError(err, [{ name: err.msg + ' ' + err.type, cuisine: '', location: { address: '' } }], callId, args, func);
                };
                getRequest.ontimeout = function() {
                    var err = { msg: TIMEOUT_MSG, type: 'ERROR: Timeout' };
                    _this.processError([{ name: err.msg, cuisine: '', location: { address: '' } }], callId, args, func);
                };

                // Opening and sending the request, adding the required user-key in the request header. The user key is supplied by Zomato.com.
                getRequest.open('GET', 'https://developers.zomato.com/api/v2.1/search?lat=' + args.place.lat + '&lon=' + args.place.lng + '&radius=5000', true);
                getRequest.setRequestHeader('Accept', 'application/json');
                getRequest.setRequestHeader('user-key', _this.restaurantsApiKey);
                getRequest.send();
            };




            /**
             * A function to query the Worldweatheronline API for the local weather forecast, local to the selected place.  The place data is passed in the args object.
             * @param {object} args - is an object to define the view and view model to be created, it will be passed to the callback function(func)
             * when calling it.
             * @param {function} func - the callback function to be passed to the callbackSync function after the request has been processed.  This 
             * function will create the view and view model necessary to display the data, returned by the HTTP request, to the user.
             */
            this.getCurrentWeather = function(args, func) {

                // Incrementing the dataRequestCount variable by 1 every time a request is made(this code is run).
                _this.dataRequestCount += 1;

                // Capturing the current dataRequestCount value as this requests id.
                var callId = _this.dataRequestCount;

                // Creating a new Http get request.
                var getRequest = new XMLHttpRequest();

                // Setting the callback for the onreadystatechange Event handler which is called when the readystate changes.
                getRequest.onreadystatechange = function() {

                    var currentWeather;

                    if (getRequest.readyState == DONE && getRequest.status == OK) {

                        // Parsing the response and setting to a variable for readability.
                        currentWeather = getRequest.response !== '' ? JSON.parse(getRequest.response) : [{ name: 'No weather data found for this location', location: { address: '' } }];

                        // Creating a unique label for caching the result
                        var stamp = args.viewVariable + args.place.id;

                        // Caching the result to reduce the number of Http requests.
                        Cache.storeResult(stamp, 600000, currentWeather);

                        // Calling the callbackSync function to check if this is the most recent request made by the user.
                        // Passing the data and the function to call if this is the most recent request.
                        _this.callbackSync(currentWeather, callId, args, func, false);

                        // If the response from server is an error, log the error
                    } else if (getRequest.status >= ERROR) {
                        var err = { msg: getRequest.responseText, type: 'ERROR: ' + getRequest.status };
                        _this.processError(err, [{ name: ERR_MSG + ' ' + err.type, cuisine: '', location: { address: '' } }], callId, args, func);
                    }
                };
                // Opening and sending the request. The user key is supplied by Worldweatheronline.com.
                getRequest.timeout = 5000;
                getRequest.onerror = function(e) {
                    var err = { msg: ERR_MSG, type: 'PROCESS EVENT: ' + e.type };
                    _this.processError(err, [{ name: err.msg + ' ' + err.type, cuisine: '', location: { address: '' } }], callId, args, func);
                };
                getRequest.ontimeout = function() {
                    var err = { msg: TIMEOUT_MSG, type: 'ERROR: Timeout' };
                    _this.processError(err, [{ name: err.msg, cuisine: '', location: { address: '' } }], callId, args, func);
                };
                getRequest.open('GET', 'https://api.worldweatheronline.com/premium/v1/weather.ashx?key=' + _this.weatherApiKey + '&q=' + args.place.lat + ',' + args.place.lng + '&format=json&num_of_days=1', true);
                getRequest.send();

            };




            this.processError = function(err, errMsg, callId, args, func) {
                console.error(err.msg);
                console.error(err.type);
                _this.callbackSync(errMsg, callId, args, func, true);
            };




            /**
             * A function to add the user selected place object to the database.
             * @param {object} place - The place object to be added to the database.
             * @param {string} uid - The unique user id given by firebase when the current user was logged in anonymously. 
             * NOTE: The uid is used as the key for the places object(the object containing all the places).  The place id is used as the key for each place object.
             */
            this.updateUserPlaces = function(place, uid) {
                firebase.database().ref(uid + '/' + place.id).update(place);
            };




            /**
             * A function to remove the selected place object residing in the firebase database.
             * @param {object} place - The place object to be removed from the database.
             * @param {string} uid - The unique user id given by firebase when the current user was logged in anonymously.
             * NOTE: The uid is used as the key for the places object(the object containing all the places).  The place id is used as the key for each place object.
             */
            this.removeUserPlace = function(place, uid) {
                firebase.database().ref(uid + '/' + place.id).remove();
            };




            /**
             * A function to create a date of string type and formatted as required by the eventful API. (ie. Feb 1st, 2017 = '2017020100')
             * @param {int} span - The time offset in years from current date.
             * @return {string} - Returns a formatted date as a string.  The date returned will be either the current date if no parameter is passed in @param span or, 
             * if a parameter is passed in, will be the current date plus the the number of years corresponding to the number passed in.
             */
            this.getFormattedDate = function(span) {

                var yearSpan = span ? span : 0;
                var newDate = new Date();
                var formattedMonth = ((newDate.getMonth() + 1) < 10) ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1);
                var date = (newDate.getFullYear() + yearSpan) + formattedMonth + newDate.getDate() + '00';

                // returning the formatted date string
                return date;
            };
        };


        // Returning the DataController constructor
        return DataController;
    });