﻿// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};
spa.controllers = spa.controllers || {};
spa.factories = spa.factories || {};
spa.services = spa.services || {};

// Angular module [app].
spa.app = (function () {
    'use strict';

    var app = angular.module('app', [
        'kendo.directives',
        'breeze.angular',
        'breeze.directives'
    ]).config(['zDirectivesConfigProvider', function (cfg)
    {
        // Custom template with warning icon before the error message
        cfg.zValidateTemplate = '<span class="invalid"><i class="icon-warning-sign icon-white"></i>%error%</span>';
    }]).config(['$httpProvider', function ($httpProvider)
    {

        /*
         Response interceptors are stored inside the 
         $httpProvider.responseInterceptors array.
         To register a new response interceptor is enough to add 
         a new function to that array.
        */

        $httpProvider.responseInterceptors.push(['$q', function ($q)
        {
            var test = '';
            // More info on $q: docs.angularjs.org/api/ng.$q
            // Of course it's possible to define more dependencies.

            return function (promise)
            {
                test = '';
                /*
                 The promise is not resolved until the code defined
                 in the interceptor has not finished its execution.
                */

                return promise.then(function (response)
                {

                    // response.status >= 200 && response.status <= 299
                    // The http request was completed successfully.

                    /*
                     Before to resolve the promise 
                     I can do whatever I want!
                     For example: add a new property 
                     to the promise returned from the server.
                    */

                    response.data.extra = 'Interceptor strikes back';

                    // ... or even something smarter.

                    /*
                     Return the execution control to the 
                     code that initiated the request.
                    */

                    return response;

                }, function (response)
                {

                    // The HTTP request was not successful.

                    /*
                     It's possible to use interceptors to handle 
                     specific errors. For example:
                    */

                    if (response.status === 401)
                    {

                        // HTTP 401 Error: 
                        // The request requires user authentication

                        response.data = {
                            status: false,
                            description: 'Authentication required!'
                        };

                        return response;

                    }

                    /*
                     $q.reject creates a promise that is resolved as
                     rejectedwith the specified reason. 
                     In this case the error callback will be executed.
                    */

                    return $q.reject(response);

                });

            };

        }]);

    }]);

    return app;
})();

// Angular service [dataService] responsible for the interaction with the server.
spa.factories.requestNotificationChannel = (function ()
{
    'use strict';

    angular.module('app').factory('requestNotificationChannel', ['$rootScope', function ($rootScope)
    {
        // private notification messages
        var _START_REQUEST_ = '_START_REQUEST_';
        var _END_REQUEST_ = '_END_REQUEST_';

        // publish start request notification
        var requestStarted = function ()
        {
            $rootScope.$broadcast(_START_REQUEST_);
        };
        // publish end request notification
        var requestEnded = function ()
        {
            $rootScope.$broadcast(_END_REQUEST_);
        };
        // subscribe to start request notification
        var onRequestStarted = function ($scope, handler)
        {
            $scope.$on(_START_REQUEST_, function (event)
            {
                handler();
            });
        };
        // subscribe to end request notification
        var onRequestEnded = function ($scope, handler)
        {
            $scope.$on(_END_REQUEST_, function (event)
            {
                handler();
            });
        };

        return {
            requestStarted: requestStarted,
            requestEnded: requestEnded,
            onRequestStarted: onRequestStarted,
            onRequestEnded: onRequestEnded
        };
    }]);
})();

// Angular service [dataService] responsible for the interaction with the server.
spa.services.dataService = (function ()
{
    'use strict';

    angular.module('app').factory('dataService', ['$http', 'breeze', function dataService($http, breeze)
    {
        // All private variables start with a "_".
        var _entityChangedToken = null;
        var _manager = null;

        function createEntity(entityTypeName)
        {
            var entity = _manager.createEntity(entityTypeName);
            return entity;
        }

        function getEntities(entityTypeName)
        {
            // Get entities from the server, based on the given entity type name.
            var query = new breeze.EntityQuery().from(entityTypeName);
            return _manager.executeQuery(query);
        }

        function getEntityType(entityTypeName)
        {
            // Get metadata for the given entitytype.
            return _manager.metadataStore.getEntityType(entityTypeName);
        }

        function getEntityTypes()
        {
            return _manager.metadataStore.getEntityTypes();
        }

        function initialize()
        {
            // Use camel case for entity properties.
            breeze.NamingConvention.camelCase.setAsDefault();

            // Configure and create EntityManager (double breeze is needed, because of .
            _manager = new breeze.EntityManager('/breeze/breeze');
            _manager.enableSaveQueuing(true);
        }

        function registerForStateChange(stateChangedHandler)
        {
            // Make sure to only subscribe once.
            if (_entityChangedToken) { return; }

            // Register for state change.
            _entityChangedToken = _manager.entityChanged.subscribe(stateChangedHandler);
        }

        function resetDatabase()
        {
            // Re-seed database and refetch data.
            return $http.get('/breeze/breeze/ReSeed');
        }

        function saveChanges()
        {
            return _manager.saveChanges();
        }
        
        var service = {
            createEntity: createEntity,
            getEntities: getEntities,
            getEntityType: getEntityType,
            getEntityTypes: getEntityTypes,
            registerForStateChange: registerForStateChange,
            resetDatabase: resetDatabase,
            saveChanges: saveChanges
        };
        
        initialize();

        return service;
    }]);
})();

// Angular controller [admin], responsible for the interaction between the [viewModel] and the [dataService].
spa.controllers.admin = (function () {
    'use strict';

    angular.module('app').controller('admin', ['$q', 'dataService', function admin($q, dataService)
    {
        // All private variables start with a "_".
        var _entityTypeName = "Employee"; // Default startpage.
        
        var vm = this;
        vm.create = function ()
        {
            // Create entity by breeze.
            var entity = dataService.createEntity(_entityTypeName);

            // Show entity to user.
            vm.entities.push(entity);
        };
        vm.delete = function (entity)
        {
            // Delete from UI
            vm.entities.pop(entity);

            // Mark for deletion.
            entity.entityAspect.setDeleted();
        };
        vm.entities = [];
        vm.entityTypes = [];
        vm.entityDataFields = null;
        vm.entityForeignkeyFields = null;
        vm.isDirty = false;
        vm.isKeyField = function (entity)
        {
            // Make 'key' fields read-only.
            return (entity.isPartOfKey);
        };
        vm.refresh = function (entityType)
        {
            // Refresh content for given entityType.
            _entityTypeName = entityType.shortName;
            refreshGrid();
        };
        vm.reset = function ()
        {
            dataService.resetDatabase().then(refreshGrid).then(showReseedInfo);
        };
        vm.save = function ()
        {
            dataService.saveChanges().then(handleSaveResult).catch(showError);
        };
        
        function refreshGrid()
        {
            return dataService.getEntities(_entityTypeName).then(handleGetEntitiesResult).catch(showError);
        }

        function getEntityTypes()
        {
            vm.entityTypes = dataService.getEntityTypes();
        }

        function getForeignKeyData(entityTypeName)
        {
            // Get entities from the server to populate the foreignkey comboboxes.
            // Use $q.all to pass the given [entityTypeName] and the result of the [dataService.getEntities].
            return $q.all({ 
                        entityTypeName: $q.when(entityTypeName),
                        entities: dataService.getEntities(entityTypeName)
                    }).then(handleGetForeignKeyDataResult).catch(showError);
        }

        function handleGetForeignKeyDataResult(data)
        {
            var entityTypeName = data.entityTypeName;
            vm[entityTypeName] = data.entities.results;
        }

        function handleGetForeignKeysDataResult(data)
        {
            vm.entityDataFields = data.dataProperties;
            vm.entities = data.entities;
            vm.isDirty = false;
        }

        function handleGetEntitiesResult(data)
        {
            // We cache the result and set vm.entities at the end of the proces, 
            // when all foreignkeydata is received, to prevent [ngField] not showing foreignkey data.
            var entities = data.results;

            // Get metadata for entity.
            var entityType = dataService.getEntityType(_entityTypeName);

            // Handle foreignkeys
            vm.entityForeignkeyFields = entityType.foreignKeyProperties;
            var promises = [];
            for (var i = 0, len = vm.entityForeignkeyFields.length; i < len; i += 1)
            {
                var foreignKey = vm.entityForeignkeyFields[i];
                promises.push(getForeignKeyData(foreignKey.relatedNavigationProperty.nameOnServer));
            }

            $q.all({
                foreignkeysData: $q.all(promises),
                dataProperties: $q.when(entityType.dataProperties),
                entities: $q.when(entities)
            }).then(handleGetForeignKeysDataResult);
        }

        function handleSaveResult()
        {
            vm.isDirty = false;
            toastr.info("Changes saved to the server.");
        }

        function handleStateChange()
        {
            vm.isDirty = true;
        }

        function initialize()
        {
            // Register for "Is dirty" checking.
            dataService.registerForStateChange(handleStateChange);

            // Fill grid.
            refreshGrid(_entityTypeName).then(getEntityTypes);
        }

        function showError(e)
        {
            // Show xhr error.
            toastr.error(e);
        }

        function showReseedInfo()
        {
            toastr.info("Database re-seeded.");
        }

        initialize();
    }]);
})();

// Angular directive [spaField] responsible for generating grid cell controls.
spa.app.directive('spaField', ['$compile', function ($compile)
{
    var directive = {
        restrict: 'A', /* Restrict this directive to attributes.  */
        replace: true, /* The given element will be replaced in the link function. */
        link: function ($scope, element, attrs)
        {
            // The data-z-validate directive will append a [span class="z-decorator"] to the following [input] element, by using the jquery "append" function.
            var html = '<input ng-disabled="{{vm.isKeyField(prop)}}" type="text" data-ng-model="entity[prop.name]" data-z-validate>';

            if ($scope.prop.relatedNavigationProperty) {
                var relatedTableName = $scope.prop.relatedNavigationProperty.nameOnServer;
                html = '<select kendo-combo-box ng-model="entity[prop.name]" ng-options="record.id as record.firstName for record in vm[\'' + relatedTableName + '\']"></select>';
            } else if ($scope.prop.dataType.name === "DateTime") {
                html = '<input kendo-date-picker k-ng-model="entity[prop.name]" k-format="\'dd-MMM-yyyy\'" />';
            } else if ($scope.prop.dataType.name === "Boolean")
            {
                html = '<input kendo-mobile-switch k-on-label="\'YES\'" k-off-label="\'NO\'" />';
            }

            // Apply scope to the created html fragment.
            var compiled = $compile(html)($scope);

            // Get the [<span class="z-decorator"] appended to the input element by the z-validate directive.
            var span = compiled[0].parentNode.children[1];

            // The following 2 lines will only add the input element to the DOM and not the [span class="z-decorator"], that is added by the z-validate directive.
            element.replaceWith(compiled);
            element = compiled;

            // Add the [span class="z-decorator"] to the current parent element of the input element.
            element.parent().append(span);
            element.parent().append(span);
        }
    };
    
    return directive;
}]);
