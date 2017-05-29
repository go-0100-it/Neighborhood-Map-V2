/**
 * Using Require.js to define a module responsible for creating a UserAuth object.
 */
define(['jquery',
        'firebase_app',
        'firebase_auth',
        'firebase_data'
    ],
    function($) {


        /**
         * A function constructor to create a new UserAuth object. The UserAuth object created handles the user log-in details,
         * monitors log in state by updating the app via callback functions upon login state changes.
         * @constructor
         * @return - returns a new UserAuth object.
         */
        var UserAuth = function() {
            var _this = this;
            this.uid = '';
            this.initialized = false;

            /**
             * A function to initiate the user sign in to firebase.
             * @param {function} func1 - the callback function to execute upon user sign in.  The function will query firebase for the list of places.
             * @param {function} func2 - the function to be passed to the callback function(func1) when the callback function is being executed.
             * The callback function(func1) being passed in, in this case, is a function to query the database.  This callback function(func1) also 
             * requires a callback function(func2) to be passed in.  The callback function(func2) passed in will be called once the results are 
             * returned from the database query.
             */
            this.initAuth = function(func1, func2, request) {

                /**
                 * Overriding the onAuthStateChanged event handler to be notified when the users logged in status changes.
                 */
                firebase.auth().onAuthStateChanged(function(user) {

                    // Checking if user has been logged in.
                    if (user) {

                        // User is signed in, assigning the uid, passed back from firebase,
                        // to a variable encapsulated within this UserAuth objects exection context for later reference.
                        _this.uid = user.uid;

                        // Checking if this is the initial user sign-in as it is only necessary to query firebase for the list of user places once.
                        // If it is the initial sign-in then call the callback function(func1).
                        if (!_this.initialized) {
                            func1(func2, _this.uid, request);
                            _this.initialized = true;
                        }

                        // If the user is not signed in.
                    } else {

                        //Requesting an anonymous user sign-in to firebase.
                        firebase.auth().signInAnonymously().catch(function(error) {

                            // If error, retriving the error code from the error object passed back.
                            var errorCode = error.code;

                            // Retriving the error message from the error object passed back.
                            var errorMessage = error.message;

                            // Printing the error details to the console.
                            console.error(errorCode + ': ' + errorMessage);

                            // Alerting user of the login error and error code.
                            alert('There was an error during authentication (error: ' + errorCode + '). The app is not connected to the database!');
                        });
                    }
                });
            };
        };

        //  Returning a new UserAuth object.
        return new UserAuth();
    });