/**
 * This small requirejs plug-in was created by Martins Barinskis.  It enables the asycronous loading of css files with requirejs.
 * His project can be found @ github --> https://github.com/martinsb/require-css.
 */

var cssloaded = false;
if (!cssloaded) {
    (function(win, cssloaded) {
        cssloaded = true;
        var doc = win.document,
            docBody = doc.body,
            createLink = function(src) {
                var link = doc.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = src;
                return link;
            },
            resolveClassName = function(moduleName) {
                var parts = moduleName.split('/');
                return parts[parts.length - 1].replace('.', '-') + '-loaded';
            };

        define({
            load: function(name, req, load) {
                var head = doc.getElementsByTagName('head')[0],
                    test,
                    interval,
                    link;

                test = doc.createElement('div');
                test.id = "test";
                test.className = resolveClassName(name);
                test.style.cssText = 'position: absolute;left:-9999px;top:-9999px;';

                docBody.appendChild(test);


                if (test.offsetHeight > 0) {
                    docBody.removeChild(test);
                    load();
                } else {
                    link = createLink(name),
                        head.appendChild(link);

                    interval = win.setInterval(function() {
                        if (test.offsetHeight > 0) {
                            clearInterval(interval);
                            docBody.removeChild(test);
                            load(link);
                        }
                    }, 50);
                }
            }
        });
    })(window);
}