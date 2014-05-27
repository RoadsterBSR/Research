
// Main entry point of the application.
var researchApp = angular.module("researchApp", ["kendo.directives"]);
researchApp.controller('researchCtrl', function ($scope)
{
    var GridModel1 = kendo.data.Model.define({
        id: 'Id',
        fields: {
            company: { type: 'string' },
            os: { type: 'string' }
        }
    });  

    var GridModel2 = kendo.data.Model.define({
        id: 'Id',
        fields: {
            FirstName: { type: 'string' },
            LastName: { type: 'string' },
            Description: { type: 'string' }
        }
    });

    var gridOptions1 = {
        dataSource: new kendo.data.DataSource({
            data: new kendo.data.ObservableArray([new GridModel1({ Id: 1, company: 'Apple', os: 'OSX' })]),
            schema: {
                model: GridModel1
            }
        })
    };

    var gridOptions2 = {
        dataSource: new kendo.data.DataSource({
            data: new kendo.data.ObservableArray([new GridModel2({ Id: 1, FirstName: 'TestFN', LastName: 'TestLN', Description: "Test desc" })]),
            schema: {
                model: GridModel2
            }
        })
    };    

    $scope.selectedType = "";

    //$scope.messages = "";
    $scope.gridOptions = gridOptions1;
    $scope.execute1 = function (e)
    {
        $scope.gridOptions = gridOptions1;
        $scope.selectedType = "Company";
    };
    $scope.execute2 = function (e)
    {
        $scope.gridOptions = gridOptions2;
        $scope.selectedType = "Employee";
    };
    
    $scope.start = function ()
    {
        //$scope.messages = "Test for databinding";
    };

    $scope.start();
});
