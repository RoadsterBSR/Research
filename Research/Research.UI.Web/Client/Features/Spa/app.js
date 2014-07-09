
// Module [app].
(function ()
{
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize'       // sanitizes html bindings (ex: sidebar.js)
    ]);

    // Handle routing errors and success events
    app.run(['$route', function ($route)
    {
        // Include $route to kick start the router.
    }]);
})();

// Controller [admin]
(function ()
{
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$scope', admin]);

    function admin($scope)
    {
        var manager = null;
        var vm = this;
        vm.title = 'Admin test page.';
        vm.employees = [];

        function initialize()
        {
            breeze.NamingConvention.camelCase.setAsDefault();
            manager = new breeze.EntityManager('/breeze/breeze');

            var query = new breeze.EntityQuery().from("Employee");
            manager.executeQuery(query).then(handleRefreshEmployees).fail(showError);
        }

        function handleRefreshEmployees(data)
        {
            vm.employees = data.results;
            $scope.$apply();
        }
        
        function showError(e)
        {
            alert(e);
        }

        initialize();
    }
})();