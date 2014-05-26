/// <reference path="../Libraries/Breeze/breeze.min.js" />

// Main entry point of the application.
var demoApp = angular.module("demoApp", ["kendo.directives"]);
demoApp.controller('demoCtrl', function ($scope)
{
    var _manager;

    $scope.getEntityModel = function ()
    {
        var model = [];
        var modelItem = {};
        var entityType = {};
        
        var entityTypes = _manager.getEntityTypes();
        for (var i = 0, length = entityTypes.length; i < length; i += 1)
        {
            entityType = entityTypes[i];
            modelItem = $scope.getModelItem(entityType);
            model.push(modelItem);
        }

        //model = [
        //{
        //    typeName: "Employee",
        //    typeDisplayName: "Employees",
        //    columns: [{
        //        field: "FirstName",
        //        title: "First Name",
        //        width: "120px"
        //    }, {
        //        field: "LastName",
        //        title: "Last Name",
        //        width: "120px"
        //    }, {
        //        field: "ProductId",
        //        title: "Product",
        //        width: "120px",
        //        values: [
        //        { "value": 1, "text": "Product 1" },
        //        { "value": 2, "text": "Product 2" },
        //        { "value": 3, "text": "Product 3" },
        //        { "value": 4, "text": "Product 4" },
        //        { "value": 5, "text": "Product 5" },
        //        { "value": 6, "text": "Product 6" },
        //        { "value": 7, "text": "Product 7" }],
        //    }],
        //    fields: {
        //        FirstName: {
        //            type: "string", validation: {
        //                required: true, firstnamevalidation: function (input)
        //                {
        //                    return $scope.handleFielValidation(input);
        //                }
        //            }
        //        },
        //        LastName: { type: "string", validation: { required: true } },
        //        ProductId: { type: "number", defaultValue: 1, validation: { required: true } }
        //    },
        //    data: new kendo.data.ObservableArray([
        //        { Id: 1, FirstName: "Rob", LastName: "Do", ProductId: 1 },
        //        { Id: 2, FirstName: "Bill", LastName: "Do", ProductId: 1 },
        //        { Id: 3, FirstName: "Joey", LastName: "Do", ProductId: 1 },
        //        { Id: 4, FirstName: "Scott", LastName: "Do", ProductId: 1 },
        //        { Id: 5, FirstName: "Harry", LastName: "Do", ProductId: 1 },
        //        { Id: 6, FirstName: "Mike", LastName: "Do", ProductId: 1 },
        //        { Id: 7, FirstName: "Morgan", LastName: "Do", ProductId: 1 }])
        //},
        //{
        //    typeName: "Product",
        //    typeDisplayName: "Product",
        //    columns: [{
        //        field: "Name",
        //        title: "Name",
        //        width: "120px"
        //    }, {
        //        field: "Price",
        //        title: "Price",
        //        width: "120px"
        //    }],
        //    fields: {
        //        Name: { type: "string", validation: { required: true } },
        //        Price: { type: "number", defaultValue: "1", validation: { required: true } }
        //    },
        //    data: new kendo.data.ObservableArray([
        //        { Id: 1, Name: "Product 1", Price: "100" },
        //        { Id: 2, Name: "Product 2", Price: "100" },
        //        { Id: 3, Name: "Product 3", Price: "100" },
        //        { Id: 4, Name: "Product 4", Price: "100" },
        //        { Id: 5, Name: "Product 5", Price: "100" },
        //        { Id: 6, Name: "Product 6", Price: "100" },
        //        { Id: 7, Name: "Product 7", Price: "100" }])
        //}
        //];

        return model;
    };
    
    $scope.getModelItem = function (entityType)
    {
        var modelItem = {};
        var column = {};
        var fieldName = "";
        var dataProperty = {};

        modelItem.typeName = entityType.name;
        modelItem.typeDisplayName = entityType.name;
        var dataProperties = entityType.dataProperties;
        
        for (var i = 0, length = dataProperties.length; i < length; i += 1)
        {
            fieldName = dataProperty.nameOnServer;
            dataProperty = dataProperties[i];
            column = {
                field: fieldName,
                title: fieldName
            };
            modelItem.columns.push(column);

            var validationFunctionName = fieldName.toLowerCase() + "validation";

            var validationObject = {};
            validationObject[validationFunctionName] = function (input)
            {
                return $scope.handleFielValidation(input);
            };

            modelItem.fields[fieldName] = {
                type: "string",
                validation: validationObject
            };
        }

        modelItem.data = new kendo.data.ObservableArray([
                { Id: 1, FirstName: "Rob", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 2, FirstName: "Bill", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 3, FirstName: "Joey", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 4, FirstName: "Scott", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 5, FirstName: "Harry", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 6, FirstName: "Mike", LastName: "Do", PhoneNumber: "0654256987" },
                { Id: 7, FirstName: "Morgan", LastName: "Do", PhoneNumber: "0654256987" }]);

        return modelItem;
    };

    $scope.getColumns = function (entityType)
    {
        var columns = [];
        var dataProperties = entityType.dataProperties;
        var column = {};
        var dataProperty = {};
        for (var i = 0, length = dataProperties.length; i < length; i += 1)
        {
            dataProperty = dataProperties[i];
            column = {
                field: dataProperty.nameOnServer,
                title: dataProperty.nameOnServer
            };
            columns.push(column);
        }

        return column;
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

    $scope.handleFielValidation = function (input)
    {
        var result = true;

        if (input && input.length > 0)
        {
            var entityName = $scope.selectedEntityType.typeName;
            var control = input[0];
            var fieldName = control.name;
            var value = control.value;
            var attribute = fieldName.toLowerCase();

            // Validate field by running.
            var validationResult = $scope.validateField(entityName, fieldName, value);

            if (!validationResult.isValid)
            {
                input.attr("data-" + attribute + "validation-msg", validationResult.message);
                result = false;
            }
        }
        
        return result;
    };
    
    $scope.getFieldValidators = function (entityName, fieldName)
    {
        var result = [];
        var entityTypes = _manager.metadataStore.getEntityTypes();
        for (var i = 0, length = entityTypes.length; i < length; i += 1)
        {
            var entityType = entityTypes[i];
            if (entityType.shortName === entityName)
            {
                var dataProperties = entityType.dataProperties;
                result = $scope.getFieldValidatorsFromDataProperties(dataProperties, fieldName);
            }
        }
        return result;
    };

    $scope.getFieldValidatorsFromDataProperties = function (dataProperties, fieldName)
    {
        var result = [];
        for (var i = 0, length = dataProperties.length; i < length; i += 1)
        {
            var dataProperty = dataProperties[i];
            if (dataProperty.nameOnServer === fieldName && dataProperty.custom && dataProperty.custom.validators && dataProperty.custom.validators.length > 0)
            {
                result = dataProperty.custom.validators;
            }
        }
        return result;
    };

    $scope.validateField = function (entityName, fieldName, fieldValue)
    {
        var result = {
            message: "",
            isValid: true
        };

        var fieldValidators = $scope.getFieldValidators(entityName, fieldName);
        for (var i = 0, length = fieldValidators.length; i < length; i += 1)
        {
            var fieldValidator = fieldValidators[i];
            var functionName = $scope.getFunctionNameFromTypeId(fieldValidator.TypeId);

            var validator = new breeze.CustomValidator();
            if (validator[functionName])
            {
                result = validator[functionName](fieldName, fieldValue, fieldValidator);
            }
        }

        return result;
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

    $scope.getEmployees = function ()
    {
        var query = new breeze.EntityQuery()
            .from("Employees");

        return _manager.executeQuery(query);
    };

    $scope.getDataFromServer = function ()
    {
        
        var query = new breeze.EntityQuery()
            .from("Employees");
        
        _manager.executeQuery(query).then(function (data)
        {
            console.log(data);
            
            return $.ajax("breeze/Breeze/CustomMetaData");
        }).then(function (data)
        {
            $scope.initialiseCustomMetaData(data);
        }).fail(function (e)
        {
            alert(e);
        });
    };

    $scope.initialiseCustomMetaData = function (data)
    {
        _manager.metadataStore.importMetadata(data, true);   
    };

    $scope.getFunctionNameFromTypeId = function (typeId)
    {
        var commaPostition = typeId.indexOf(",");
        var functionName = typeId.substring(0, commaPostition);
        functionName = functionName.replace(/\./g, '_');
        return functionName;
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
        // Get MetaData
        var breezeControllerUrl = 'breeze/breeze';
        _manager = new breeze.EntityManager(breezeControllerUrl);

        $scope.getEmployees()
        .then(function (data)
        {
            console.log(data);

            // Get custom metadata.
            return $.ajax("breeze/Breeze/CustomMetaData");
        }).then(function (data)
        {
            $scope.initialiseCustomMetaData(data);
            $scope.entityModel = $scope.getEntityModel();
            $scope.selectedEntityType = $scope.entityModel[index];
            $scope.mainGridOptions = $scope.getGridDataSource();
        }).fail(function (e)
        {
            alert(e);
        });
    };

    // Initialise view.
    $scope.initialise(0);
});