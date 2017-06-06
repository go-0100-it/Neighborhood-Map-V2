/**
 * Using Require.js to define a module responsible for creating a template loader
 */
define(
    [
        'jquery'
    ],
    function(
        $
    ) {
        /**
         * The following simple template loader was created by Benjamin Nickolls and pubished as a Gist found @ https://gist.github.com/BenJam/4504134
         */
        var templateLoader = {

            // Hash of preloaded templates for the app
            templates: {},

            // Recursively pre-load all the templates for the app.
            loadTemplates: function(names, callback) {

                // Getting a reference to this execution context for later reference.
                var _this = this;


                var loadTemplate = function(index) {
                    var name = names[index];
                    $.get('templates/' + name + '.html', function(data) {
                        _this.templates[name] = data;
                        index++;
                        if (index < names.length) {
                            loadTemplate(index);
                        } else {
                            callback();
                        }
                    });
                };
                loadTemplate(0);
            },

            // Get template by name from hash of preloaded templates
            get: function(name) {
                return this.templates[name];
            }
        };
        return templateLoader;
    });