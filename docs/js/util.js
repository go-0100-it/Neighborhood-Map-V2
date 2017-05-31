/**
 * Using Require.js to define a module responsible for...
 */
define(
    [
        'jquery'
    ],
    function(
        $
    ) {

        var templateLoader = {

            // Hash of preloaded templates for the app
            templates: {},

            // Recursively pre-load all the templates for the app.
            // This implementation should be changed in a production environment. All the template files should be
            // concatenated in a single file.
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