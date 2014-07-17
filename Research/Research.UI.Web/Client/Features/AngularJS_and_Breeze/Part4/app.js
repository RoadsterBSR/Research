// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};
spa.controllers = spa.controllers || {};
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
    }]);

    //Configure the Breeze Validation Directive for bootstrap 2
    

    return app;
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
        link: function ($scope, element, attrs) {
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

            var compiled = $compile(html)($scope);
            var span = compiled[0].parentNode.children[1];
            element.replaceWith(compiled);
            element = compiled;
            element.parent().append(span);
        }
    };
    
    return directive;
}]);