// Use namespaces to prevent pollution of the global namespace.
var spa = spa || {};
spa.controllers = spa.controllers || {};

// Angular module [app].
spa.app = (function ()
{
    'use strict';

    var app = angular.module('app', [
        'breeze.angular' // The breeze service module.
    ]);
})();

// Angular controller [admin].
spa.controllers.admin = (function ()
{
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['breeze', admin]);

    function admin(breeze)
    {
        var manager = null;
        var entityTypeName = "Employee";

        var vm = this;
        vm.delete = function (entity)
        {
            // Delete from UI
            vm.entities.pop(entity);

            // Mark for deletion.
            entity.entityAspect.setDeleted();
        };
        vm.entities = [];
        vm.entityFields = null;
        vm.isReadOnlyField = function (name)
        {
            // Make 'id' fields read-only.
            return (name === 'id');
        };
        vm.save = function ()
        {
            manager.saveChanges().then(showChangesSavedInfo).catch(showError);
        };

        function initialize()
        {
            // Use camel case for entity properties.
            breeze.NamingConvention.camelCase.setAsDefault();

            // Configure and create EntityManager (double breeze is needed, because of .
            manager = new breeze.EntityManager('/breeze/breeze');
            manager.enableSaveQueuing(true);

            // Get entities from the server.
            var query = new breeze.EntityQuery().from(entityTypeName);
            manager.executeQuery(query).then(handleRefresh).catch(showError);
        }

        function handleRefresh(data)
        {
            // Get entity fields from metadata.
            var entityMetaData = manager.metadataStore.getEntityType(entityTypeName);
            vm.entityFields = entityMetaData.dataProperties;

            // Show the enties from the server.
            vm.entities = data.results;
        }

        function showError(e)
        {
            // Show xhr error.
            toastr.error(e);
        }

        function showChangesSavedInfo()
        {
            // Show info message.
            toastr.info("Changes saved to the server.");
        }

        initialize();
    }
})();