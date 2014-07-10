var spa = spa || {};
spa.controllers = spa.controllers || {};

// Module [app].
spa.app = (function ()
{
    'use strict';

    var app = angular.module('app', [
        'breeze.angular'    // The breeze service module.
    ]);
})();

spa.controllers.admin = (function ()
{
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$http', '$q', '$scope', 'breeze', admin]);

    function admin($http, $q, $scope, breeze)
    {
        var manager = null;
        var entityTypeName = "Employee";

        var vm = this;
        vm.entities = [];
        vm.close = function ()
        {
            vm.showEdit = false;
        };
        vm.create = function ()
        {
            debugger;
        };
        vm.delete = function (entity)
        {
            // Delete from UI
            vm.entities.pop(entity);

            // Mark for deletion.
            entity.entityAspect.setDeleted();           

            // Save change to server.
            manager.saveChanges();

            toastr.info(entityTypeName + " deleted.");
        };
        vm.edit = function (entity)
        {
            vm.showEdit = true;
            vm.selected.entity = entity;

            var entityMetaData = manager.metadataStore.getEntityType(entityTypeName);
            vm.selected.entityFields = entityMetaData.dataProperties;
        };
        vm.selected = {};
        vm.selected.entity = null;
        vm.selected.entityFields = null;
        vm.showEdit = false;

        function initialize()
        {
            // Use camel case for entity properties.
            breeze.NamingConvention.camelCase.setAsDefault();

            // Configure and create EntityManager.
            // TODO: remove one of the double "breeze", by adjusting Web Api routing.
            manager = new breeze.EntityManager('/breeze/breeze');
            manager.enableSaveQueuing(true);

            // Get entities from the server.
            var query = new breeze.EntityQuery().from(entityTypeName);
            manager.executeQuery(query).then(handleRefresh).catch(showError);
        }
        
        function handleRefresh(data)
        {
            // Show the enties from the server.
            vm.entities = data.results;
        }
        
        function showError(e)
        {
            toastr.error(e);
        }

        initialize();
    }
})();