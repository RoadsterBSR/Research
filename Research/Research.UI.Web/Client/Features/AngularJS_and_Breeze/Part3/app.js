// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};
spa.controllers = spa.controllers || {};

// Angular module [app].
spa.app = (function () {
    'use strict';

    var app = angular.module('app', [
        'breeze.angular' // The breeze service module.
    ]);

    return app;
})();

// Angular controller [admin].
spa.controllers.admin = (function () {
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$http', '$q', 'breeze', admin]);
    
    function admin($http, $q, breeze) {
        var entityChangedToken = null;
        var _entityTypeName = "Employee";
        var manager = null;

        var vm = this;
        vm.create = function () {
            // Create entity by breeze.
            var entity = manager.createEntity(_entityTypeName);
            // Show entity to user.
            vm.entities.push(entity);
        };
        vm.delete = function (entity) {
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
        vm.isKeyField = function (entity) {
            // Make 'key' fields read-only.
            return (entity.isPartOfKey);
        };
        vm.refresh = function (entityType) {
            // Refresh content for given entityType.
            _entityTypeName = entityType.shortName;
            getData(_entityTypeName);
        };
        vm.reset = function () {
            // Re-seed database and refetch data.
            $http.get('/breeze/breeze/ReSeed').then(getData(_entityTypeName)).then(handleResetResult).catch(showError);
        };
        vm.save = function () {
            manager.saveChanges().then(handleSaveResult).catch(showError);
        };

        function handleStateChange() {
            vm.isDirty = true;
        }

        function getData(entityTypeName) {
            // Get entities from the server.
            var query = new breeze.EntityQuery().from(entityTypeName);
            var resultHandler = new spa.ResultHandler(entityTypeName, handleGetDataResult);
            return manager.executeQuery(query).then(resultHandler.handleResult).catch(showError);
        }

        function getEntityTypes() {
            vm.entityTypes = manager.metadataStore.getEntityTypes();
        }

        function getForeignKeyData(entityTypeName) {
            // Get entities from the server.
            var query = new breeze.EntityQuery().from(entityTypeName);
            var resultHandler = new spa.ResultHandler(entityTypeName, handleGetForeignKeyDataResult);
            return manager.executeQuery(query).then(resultHandler.handleResult).catch(showError);
        }

        function handleGetDataResult(data) {
            // Get entity fields from metadata.
            var resultHandler = this;
            var entityMetaData = manager.metadataStore.getEntityType(resultHandler.getAdditionalData());
            

            vm.entityForeignkeyFields = entityMetaData.foreignKeyProperties;
            var promises = [];
            for (var i = 0, len = vm.entityForeignkeyFields.length; i < len; i += 1) {
                var foreignKey = vm.entityForeignkeyFields[i];
                promises.push(getForeignKeyData(foreignKey.relatedNavigationProperty.nameOnServer));
            }
            $q.all(promises).then(function () {
                vm.entityDataFields = entityMetaData.dataProperties;
                // Show the enties from the server.
                vm.entities = data.results;
                vm.isDirty = false;
            });
        }

        function handleGetForeignKeyDataResult(data) {
            var resultHandler = this;
            var entityTypeName = resultHandler.getAdditionalData();
            vm[entityTypeName] = data.results;
        }

        function handleResetResult() {
            vm.isDirty = false;
            toastr.info("Database re-seeded.");
        }

        function handleSaveResult() {
            vm.isDirty = false;
            toastr.info("Changes saved to the server.");
        }

        function initialize() {
            // Use camel case for entity properties.
            breeze.NamingConvention.camelCase.setAsDefault();

            // Configure and create EntityManager (double breeze is needed, because of .
            manager = new breeze.EntityManager('/breeze/breeze');
            manager.enableSaveQueuing(true);
            registerForStateChange();

            getData(_entityTypeName).then(getEntityTypes);
        }

        function registerForStateChange() {
            // Make sure to only subscribe once.
            if (entityChangedToken) { return; }

            // Register for state change.
            entityChangedToken = manager.entityChanged.subscribe(handleStateChange);
        }

        function showError(e) {
            // Show xhr error.
            toastr.error(e);
        }

        initialize();
    }
})();

spa.ResultHandler = function (additionalData, handleResultFunc) {
    var self = this;
    var _additionalData = additionalData;
    var _handleResultFunc = handleResultFunc;  

    self.getAdditionalData = function () {
        return _additionalData;
    };

    self.handleResult = function (data)
    {
        _handleResultFunc.call(self, data);
    };

    return self;
};

spa.app.directive('ngField',['$compile', function ($compile) {

    var directive = {
        restrict: 'A', /* restrict this directive to elements */

        link: function ($scope, element, attrs) {
            var html = '<input ng-disabled="{{vm.isKeyField(prop)}}" type="text" ng-model="entity[prop.name]">';
            if ($scope.prop.relatedNavigationProperty) {
                var relatedTableName = $scope.prop.relatedNavigationProperty.nameOnServer;
                html = '<select ng-model="entity[prop.name]" ng-options="record.id as record.firstName for record in vm[\'' + relatedTableName + '\']"></select>';
            }
            var compiled = $compile(html)($scope);
            element.replaceWith(compiled);
            element = compiled;
        }
    };
    
    return directive;
}]);