/// <reference path="../Libraries/Breeze/breeze.min.js" />

// Main entry point of the application.
var demoApp = angular.module("demoApp", ["kendo.directives"]);
demoApp.controller('demoCtrl', function ($scope)
{
    var _manager;
    var _customMetaData;

    $scope.getEntityModel = function ()
    {
        var model = [];
        var modelItem = {};
        var entityType = {};
        
        // All entities must have a field "Id" as primairykey.
        modelItem.id = "Id";

        var entityTypes = _manager.metadataStore.getEntityTypes();
        for (var i = 0, length = entityTypes.length; i < length; i += 1)
        {
            entityType = entityTypes[i];
            modelItem = $scope.getModelItem(entityType);
            model.push(modelItem);
        }

        return model;
    };
    
    $scope.getModelItem = function (entityType)
    {
        var modelItem = {};
        var column = {};
        var fieldName = "";
        var dataProperty = {};
        var dataProperties = {};
        var validationFunctionName = "";
        var validationObject = {};

        modelItem.typeName = entityType.shortName;
        modelItem.typeDisplayName = entityType.shortName;
        modelItem.columns = [];
        modelItem.fields = {};
        modelItem.data = [];

        dataProperties = entityType.dataProperties;
        for (var i = 0, length = dataProperties.length; i < length; i += 1)
        {
            dataProperty = dataProperties[i];
            fieldName = dataProperty.nameOnServer;

            // Skip 'Id' fields, because Id fields are used as model
            if (fieldName.toLowerCase() !== 'id') {
                column = {
                    field: fieldName,
                    title: fieldName
                };
                modelItem.columns.push(column);

                validationFunctionName = fieldName.toLowerCase() + "validation";
                validationObject = {};
                validationObject[validationFunctionName] = function (input) {
                    return $scope.handleFielValidation(input);
                };

                var modelType = $scope.getModelType(dataProperty.dataType);
                modelItem.fields[fieldName] = {
                    type: modelType,
                    validation: validationObject
                };
            }
        }

        modelItem.data = new kendo.data.ObservableArray([]);

        return modelItem;
    };

    $scope.getModelType = function (databaseType) {
        var result = "string";

        // Kendo ModelTypes are: "string", "number", "boolean", "date".
        var name = databaseType.name;
        
        if (name === "Int32" || name === "Float" || name === "Double" || name === "Decimal") {
            result = "Number";
        }

        if (name === "Boolean") {
            result = "boolean";
        }

        if (name === "DateTime" || name === "Date") {
            result = "date";
        }
        
        return result;
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

    $scope.getGridDataSource = function (data, selectedEntityType)
    {
        var result = {};
        if (selectedEntityType) {
            result = {
                dataSource: {
                    data: data,
                    batch: false,
                    pageSize: 5,
                    schema: {
                        model: {
                            id: "Id",
                            fields: selectedEntityType.fields
                        }
                    }
                },
                editable: "popup",
                sortable: true,
                pageable: true,
                columns: $scope.getGridColumnsWithCommandColumn(selectedEntityType.columns)
            };
        }
        return result;
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

    $scope.getData = function (entityListName)
    {
        var query = new breeze.EntityQuery()
            .from(entityListName);

        return _manager.executeQuery(query);
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
        var entityType = $scope.entityModel[index];
        $scope.selectedEntityType = entityType;

        $scope.getData($scope.selectedEntityType.typeName)
        .then(function (data) {
            var observableArray = $scope.convertToObservableArray(data.results);
            $scope.selectedEntityType.data = observableArray;
            $scope.mainGridOptions = $scope.getGridDataSource(observableArray, $scope.selectedEntityType);
            $scope.reDrawGrid($scope.mainGridOptions);
        }).fail(function (e) {
            alert(e);
        });
    };

    $scope.convertToObservableArray = function (data) {
        var result = new kendo.data.ObservableArray([]);

        for (var i = 0, length = data.length; i < length; i += 1) {
            result.push(data[i]._backingStore);
        }
        return result;
    };

    $scope.reDrawGrid = function (mainGridOptions) {
        // TODO: Remove jQuery from controller!!
        // Must destroy and empty grid before refreshing columns.
        if ($('#crudGrid').data().kendoGrid) {
            $('#crudGrid').data().kendoGrid.destroy();
            $('#crudGrid').empty();
        }
        
        $('#crudGrid').kendoGrid(mainGridOptions);
    };

    $scope.start = function () {
        var breezeControllerUrl = 'breeze/breeze';
        _manager = new breeze.EntityManager(breezeControllerUrl);

        // Get custom metadata.
        Q($.ajax("breeze/Breeze/CustomMetaData"))
        .then(function (data)
        {
            _customMetaData = data;
            return $scope.getData("Employee");
        })
        .then(function (data) {
            var observableArray = $scope.convertToObservableArray(data.results);

            $scope.initialiseCustomMetaData(_customMetaData);
            $scope.entityModel = $scope.getEntityModel();
            var employeeEntityType = {};
            for (var i = 0, length = $scope.entityModel.length; i < length; i += 1)
            {
                var entityType = $scope.entityModel[i];
                if (entityType.typeName === "Employee")
                {
                    employeeEntityType = entityType;
                }
            }
            $scope.selectedEntityType = employeeEntityType;
            $scope.mainGridOptions = $scope.getGridDataSource(observableArray, $scope.selectedEntityType);
            $scope.reDrawGrid($scope.mainGridOptions);
        }).fail(function (e) {
            alert(e);
        });
    };

    // Start application
    $scope.start();
});