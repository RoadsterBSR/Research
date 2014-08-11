// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};

spa.app = (function () {
    'use strict';

    var self = {};

    var model = {
        label: 'Default',
        completed: false
    };
    
    function observer(changes)
    {
        changes.forEach(function (change, i)
        {
            console.log('what property changed? ' + change.name);
            console.log('how did it change? ' + change.type);
            console.log('whats the current value? ' + change.object[change.name]);
            console.log(change); // all changes
        });
    }

    self.start = function ()
    {
        // Start observing the model.
        Object.observe(model, observer);

        // Change model to show databinding.
        model.label = 'Buy some more milk';
    };

    return self;
})();

// Start the application.
spa.app.start();