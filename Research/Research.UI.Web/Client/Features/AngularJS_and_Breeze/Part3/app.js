// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};
spa.controllers = spa.controllers || {};

// Angular module [app].
spa.app = (function () {
    'use strict';

    var app = angular.module('app', [
        'breeze.angular' // The breeze service module.
    ]);
})();

// Angular controller [admin].
spa.controllers.admin = (function () {
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$http', 'breeze', admin]);

    function admin($http, breeze) {
        var entityChangedToken = null;
        var entityTypeName = "Employee";
        var manager = null;

        var vm = this;
        vm.create = function () {
            // Create entity by breeze.
            var entity = manager.createEntity(entityTypeName);
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
        vm.entityFields = null;
        vm.isDirty = false;
        vm.isReadOnlyField = function (name) {
            // Make 'id' fields read-only.
            return (name === 'id');
        };
        vm.reset = function () {
            // Re-seed database and refetch data.
            $http.get('/breeze/breeze/ReSeed').then(getData).then(handleResetResult).catch(showError);
        };
        vm.save = function () {
            manager.saveChanges().then(handleSaveResult).catch(showError);
        };

        function handleStateChange(args) {
            vm.isDirty = true;
        }

        function getData() {
            // Get entities from the server.
            var query = new breeze.EntityQuery().from(entityTypeName);
            manager.executeQuery(query).then(handleGetDataResult).catch(showError);
        }

        function initialize() {
            // Use camel case for entity properties.
            breeze.NamingConvention.camelCase.setAsDefault();

            // Configure and create EntityManager (double breeze is needed, because of .
            manager = new breeze.EntityManager('/breeze/breeze');
            manager.enableSaveQueuing(true);
            registerForStateChange();

            getData();
        }

        function handleGetDataResult(data) {
            // Get entity fields from metadata.
            var entityMetaData = manager.metadataStore.getEntityType(entityTypeName);
            vm.entityFields = entityMetaData.dataProperties;
            
            // Show the enties from the server.
            vm.entities = data.results;
            vm.isDirty = false;
        }

        function handleResetResult() {
            vm.isDirty = false;
            toastr.info("Database re-seeded.");
        }

        function handleSaveResult() {
            vm.isDirty = false;
            toastr.info("Changes saved to the server.");
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