
// Main entry point of the application.
var researchApp = angular.module("researchApp", ["kendo.directives"]);
researchApp.controller('researchCtrl', function ($scope)
{
    $scope.messages = "";

    $scope.getFunctionNameFromTypeId = function(typeId)
    {
        var commaPostition = typeId.indexOf(",");
        var functionName = typeId.substring(0, commaPostition);
        functionName = functionName.replace(/\./g, '_');
        return functionName;
    };

    $scope.start = function ()
    {
        var functionName = $scope.getFunctionNameFromTypeId("Research.UI.Web.Validation.FieldValidators.StringLengthRangeAttribute, Research.UI.Web, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null");
        $scope.messages = functionName;
    };

    $scope.start();
});