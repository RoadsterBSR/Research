// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};

spa.app = (function () {
    'use strict';

    var self = {};
    
    self.initializeGlobalExceptionHandler = function ()
    {
        window.onerror = function (message, file, line, col, error)
        {
            console.log(message, "from", error.stack);
        };
    };

    self.start = function ()
    {
        spa.app.initializeGlobalExceptionHandler();

        var offSet = getOffSetBasedOnCollapseStatus(300, 1);
        adjustTop(document.getElementById('cmp-details'), offSet);
    };

    function adjustTop(element, value)
    {
        if (element && element.offsetTop && value)
        {
            element.style.top = (element.offsetTop + value) + 'px';
        }
    }

    // Status: 0 = collapsed, 1 = expanded
    function getOffSetBasedOnCollapseStatus(offSet, status)
    {
        var newOffSet = Math.abs(offSet);

        if (offSet && status === 1)
        {
            newOffSet = -newOffSet;
        }

        return newOffSet;
    }

    return self;
})();
spa.app.start();