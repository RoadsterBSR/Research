/// <reference path="../Libraries/Breeze/breeze.min.js" />

// Main entry point of the application.
var demoApp = angular.module("demoApp", ["kendo.directives"]);
demoApp.controller('demoCtrl', function ($scope)
{
    $scope.getEntityModel = function ()
    {
        return [
        {
            typeName: "Employee",
            typeDisplayName: "Employees",
            columns: [{
                field: "FirstName",
                title: "First Name",
                width: "120px"
            }, {
                field: "LastName",
                title: "Last Name",
                width: "120px"
            }, {
                field: "ProductId",
                title: "Product",
                width: "120px",
                values: [
                { "value": 1, "text": "Product 1" },
                { "value": 2, "text": "Product 2" },
                { "value": 3, "text": "Product 3" },
                { "value": 4, "text": "Product 4" },
                { "value": 5, "text": "Product 5" },
                { "value": 6, "text": "Product 6" },
                { "value": 7, "text": "Product 7" }],
            }],
            fields: {
                FirstName: { type: "string", validation: { required: true } },
                LastName: { type: "string", validation: { required: true } },
                ProductId: { type: "number", defaultValue: 1, validation: { required: true } }
            },
            data: new kendo.data.ObservableArray([
                { Id: 1, FirstName: "Rob", LastName: "Do", ProductId: 1 },
                { Id: 2, FirstName: "Bill", LastName: "Do", ProductId: 1 },
                { Id: 3, FirstName: "Joey", LastName: "Do", ProductId: 1 },
                { Id: 4, FirstName: "Scott", LastName: "Do", ProductId: 1 },
                { Id: 5, FirstName: "Harry", LastName: "Do", ProductId: 1 },
                { Id: 6, FirstName: "Mike", LastName: "Do", ProductId: 1 },
                { Id: 7, FirstName: "Morgan", LastName: "Do", ProductId: 1 }])
        },
        {
            typeName: "Product",
            typeDisplayName: "Product",
            columns: [{
                field: "Name",
                title: "Name",
                width: "120px"
            }, {
                field: "Price",
                title: "Price",
                width: "120px"
            }],
            fields: {
                Name: { type: "string", validation: { required: true } },
                Price: { type: "number", defaultValue: "1", validation: { required: true } }
            },
            data: new kendo.data.ObservableArray([
                { Id: 1, Name: "Product 1", Price: "100" },
                { Id: 2, Name: "Product 2", Price: "100" },
                { Id: 3, Name: "Product 3", Price: "100" },
                { Id: 4, Name: "Product 4", Price: "100" },
                { Id: 5, Name: "Product 5", Price: "100" },
                { Id: 6, Name: "Product 6", Price: "100" },
                { Id: 7, Name: "Product 7", Price: "100" }])
        }
        ];
    };
    
    $scope.getGridDataSource = function ()
    {
        return {
            dataSource: {
                data: $scope.selectedEntityType.data,
                batch: false,
                pageSize: 5,
                schema: {
                    model: {
                        id: "Id",
                        fields: $scope.selectedEntityType.fields
                    }
                }
            },
            editable: "popup",
            sortable: true,
            pageable: true,
            columns: $scope.getGridColumnsWithCommandColumn($scope.selectedEntityType.columns)
        };
    };

    $scope.getGridColumnsWithCommandColumn = function (columns)
    {
        var columnsWithCommandColumn = [];

        // Columns are copied, because the original data must not be changed.
        columnsWithCommandColumn = columns.splice(0);

        // Add the command column.
        var commandColumn = {
            command: [
                { name: "edit", text: { edit: "Edit", cancel: "Cancel", update: "Update" } },
                { name: "destroy", text: "Remove" }
            ]
        };
        columnsWithCommandColumn.push(commandColumn);
        
        return columnsWithCommandColumn;
    };

    $scope.getDataFromServer = function ()
    {
        
        var manager = new breeze.EntityManager('breeze/breeze');

        var query = new breeze.EntityQuery()
            .from("Employees");
        
        manager.executeQuery(query).then(function (data)
        {
            console.log(data);


            var customMetadata = {
                "structuralTypes": [{
                    "shortName": "Employee",
                    "namespace": "Research.UI.Web.Server.Model",
                    "dataProperties": [ {
                        "nameOnServer": "PhoneNumber",
                        "custom": {                     
                            "description": "This is custom information."
                        }
                    }]
                }]};
            manager.metadataStore.importMetadata(customMetadata, true);






            var entityTypes = manager.metadataStore.getEntityTypes();
            console.log(entityTypes);
        }).fail(function (e)
        {
            alert(e);
        });
    };

    $scope.entityTypeChanged = function (e)
    {
        var index = e.sender.selectedIndex;
        $scope.initialise(index);

        // TODO: Remove jQuery from controller!!
        // Must destroy and empty grid before refreshing columns.
        $('#crudGrid').data().kendoGrid.destroy();
        $('#crudGrid').empty();
        $('#crudGrid').kendoGrid($scope.mainGridOptions);

    };

    $scope.initialise = function (index)
    {
        // Initialise $scope with new data.
        $scope.entityModel = $scope.getEntityModel();
        $scope.selectedEntityType = $scope.entityModel[index];
        $scope.mainGridOptions = $scope.getGridDataSource();

        $scope.getDataFromServer();
    };

    // Initialise view.
    $scope.initialise(0);
});