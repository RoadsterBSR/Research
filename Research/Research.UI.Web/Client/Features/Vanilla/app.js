// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};

spa.app = (function () {
    'use strict';

    var self = {};
          

    self.Step1 = function ()
    {
        self.Step2();
    };

    self.Step2 = function ()
    {
        self.Step3();
    };

    self.Step3 = function ()
    {        
        if (window.XMLHttpRequest)
        {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://www.google.com', true);

            request.onload = function ()
            {
                if (this.status >= 200 && this.status < 400)
                {
                    // Success!
                    var data = JSON.parse(this.response);
                    console.log(data);
                } else
                {
                    // We reached our target server, but it returned an error
                    console.log("Error status not between 200 and 400.");
                }
            };

            request.onerror = function (e)
            {
                debugger;
                // There was a connection error of some sort
                console.log(e);
            };

            request.send();
        }
        
    };

    self.onExecuteClick = function ()
    {
        self.Step1();
    };

    self.start = function ()
    {
        window.onerror = function (message, file, line, col, error)
        {
            debugger;
            console.log(message, "from", error.stack);
        };
    };

    return self;
})();

// Start the application.
spa.app.start();