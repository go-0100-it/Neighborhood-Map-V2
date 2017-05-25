/**
 * Using Require.js to define a module responsible for creating a Cache object and defining the modules that are required by this module.
 */
define([
        'jquery'
    ],
    function(
        $
    ) {


        /**
         * @constructor - Creates a Cache object.
         * 
         * This Cache controller object is responsible for managing the storage and retrieval of all data requested and received by HTTP requests.
         * Since this constructor returns a single instance of new cache object it should only be called from the data controller.  Theoretically, you could 
         * create multiple Cashe objects but each would be a separate instance and therefore have no relationship with one another.
         * @return - returns a new Cache Object.
         */
        var Cache = function() {
            var _this = this;

            // An array to store the created stamps(request Ids).  
            this.requestArray = [];

            // The array to store the created Data objects.
            this.storage = [];



            /**
             * @constructor - Creates a Data object.
             * 
             * @param {string} stamp - a unique stamp(request Id) created by combining a place id and the view variable(view type).
             * @param {number} life - time in MS till the data will be considered stale(expired).
             * 
             * NOTE: The param passed to result can be either an object or an array.
             * @param {object} result - the object data returned from the HTTP request.
             * @param {array} result -  the array data returned from the HTTP request.
             */
            var Data = function(stamp, life, result) {

                // a unique stamp(request Id) created by combining a place id and the view variable(view type)
                this.stamp = stamp;

                // time in MS till the data will be considered stale(expired).
                this.life = life;

                // capturing current time for stale time reference
                this.timeStamp = new Date().getTime();

                // the data returned from the HTTP request
                this.result = result;


                /**
                 * A function to determine if this data is stale.
                 * @return - returns true if the data is stale(expired), false if it is not stale(fresh).
                 */
                this.isStale = function() {
                    var currentTime = new Date().getTime();
                    return currentTime > this.timeStamp + this.life ? true : false;
                };
            };




            /**
             * A function to call the Data constructorn to create a Data object and store the data object in the Cache storage array.
             * @param {string} stamp - a unique stamp(request Id) created by combining a place id and the view variable(view type).
             * @param {number} life - time in MS till the data will be considered stale(expired).
             * 
             * NOTE: The param passed to result can be either an object or an array.
             * @param {object} result - the object data returned from the HTTP request.
             * @param {array} result -  the array data returned from the HTTP request.
             */
            this.storeResult = function(stamp, life, result) {
                // Creating a new Data object to store.
                var data = new Data(stamp, life, result);

                // Pushing the unique stamp to an array.  The array will be queried later at future HTTP requests. 
                _this.requestArray.push(stamp);

                // Storing the data in the Cache storage array.
                _this.storage.push(data);
            };




            /**
             * A function to check if, a stamp(request Id) that matches the stamp passed in, exists in the requestArray.
             * @param {string} stamp - the stamp(request Id) to search for in the array.
             * @return - returns true if the stamp exist in the array, false if it does not.
             */
            this.has = function(stamp) {
                return _this.requestArray.indexOf(stamp) !== -1 ? true : false;
            };




            /**
             * A function to iterate through the storage array and remove data that has become stale.  To be called prior to the this.has function
             * to ensure only fresh(not stale) data is found in the storage.
             */
            this.clearStale = function() {

                // declaring an array to create a temporary modified copy of the storage array.
                var arr1 = [];

                // declaring an array to create a temporary modified copy of the requestArray array.
                var arr2 = [];

                // iterating the storage array and pushing the values that are not stale to the temp array.  Doing this for both the storage array and 
                // the requestArray as these arrays have corresponding values and must be kept in sequence.
                $.each(_this.storage, function(index, value) {
                    if (!value.isStale()) {
                        arr1.push(value);
                        arr2.push(value.stamp);
                    }

                    // replacing the original array data with the fresh(not stale) data from the temporary arrays.
                    _this.storage = arr1;
                    _this.requestArray = arr2;
                });
            };




            /**
             * A function to retrieve data stored in the Cache with a matching stamp to the one passed in.
             * @param {string} stamp - the stamp(request Id) to search for in the array.
             * NOTE:  This function assumes the data requested exists, it is necessary to call the this.has function prior to calling this function to
             * ensure the stamp exists.
             */
            this.getCachedData = function(stamp) {
                return _this.storage[_this.requestArray.indexOf(stamp)].result;
            };

        };

        // returning an instance of a new Cache object.
        return new Cache();
    });