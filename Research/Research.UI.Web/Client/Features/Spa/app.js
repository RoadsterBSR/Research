
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
        var vm = this;
        vm.title = 'Admin test page.';
        vm.employees = [];

        breeze.NamingConvention.camelCase.setAsDefault();
        var manager = new breeze.EntityManager('/breeze/breeze');

        var query = new breeze.EntityQuery()
            .from("Employee");

        manager.executeQuery(query).then(handleRefreshEmployees).fail(function (e)
        {
            alert(e);
        });

        function handleRefreshEmployees(data)
        {
            //vm.employees = [{ firstName: 'Test' }, { firstName: 'Test2' }];
            vm.employees = data.results;
            $scope.$apply();
            //$scope.$apply(function ()
            //{
            //    refreshEmployees(data);
            //});
        }

        function refreshEmployees(data)
        {
            vm.employees = [{ firstName: 'Test' }, { firstName: 'Test2' }];
        }
    }
})();