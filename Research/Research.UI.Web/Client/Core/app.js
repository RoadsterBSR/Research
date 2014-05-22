
// Main entry point of the application.
var demoApp = angular.module("demoApp", ["kendo.directives"]);
demoApp.controller('demoCtrl', function ($scope)
{
    $scope.employees = new kendo.data.ObservableArray([
        { Id: 1, FirstName: "fn_1", LastName: "ln_1" },
        { Id: 2, FirstName: "fn_2", LastName: "ln_2" },
        { Id: 3, FirstName: "fn_3", LastName: "ln_3" },
        { Id: 4, FirstName: "fn_4", LastName: "ln_4" },
        { Id: 5, FirstName: "fn_5", LastName: "ln_5" },
        { Id: 6, FirstName: "fn_6", LastName: "ln_6" },
        { Id: 7, FirstName: "fn_7", LastName: "ln_7" }
    ]);

    $scope.gridData = $scope.employees;

    $scope.mainGridOptions = {
        dataSource: {
            data: $scope.gridData,
            batch: false,
            pageSize: 5,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        FirstName: { type: "string", validation: { required: true } },
                        LastName: { editable: true }
                    }
                }
            }
        },
        editable: "popup",
        sortable: true,
        pageable: true,
        columns: [{
            field: "FirstName",
            title: "First Name",
            width: "120px"
        }, {
            field: "LastName",
            title: "Last Name",
            width: "120px"
        },
        {
            command: [{
                name: "edit",
                text: { edit: "Custom edit", cancel: "Custom cancel", update: "Custom update" }
                },
                { name: "destroy", text: "Remove" }
            ]
        }]
    };
});