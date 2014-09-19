
var kendo = kendo || {};

$.getResolvedPromise = function (data)
{
    data = data || [];
    var dfd = new $.Deferred();
    dfd.resolve(data);
    return dfd.promise();
};

var dataService = (function ()
{
    "use strict";
    var self = {};
            
    self.getRouteOnderdeelSecties = function (routeOnderdeelId)
    {
        if (!routeOnderdeelId) { throw "Parameter [routeOnderdeelId] is not set."; }

        var secties = new kendo.data.ObservableArray(
        [
            { Id: 1, Postcode6GroepSectieId: 1, Adres: 'Kerkweg 22', Lat: '52.367443', Long: '4.865275', Selected: false, IsFixed: false },
            { Id: 2, Postcode6GroepSectieId: 1, Adres: 'Peilstraat 3', Lat: '52.367967', Long: '4.866217', Selected: false, IsFixed: true },
            { Id: 3, Postcode6GroepSectieId: 1, Adres: 'Bakkerloop 35', Lat: '52.367946', Long: '4.865482', Selected: false, IsFixed: false },
            { Id: 4, Postcode6GroepSectieId: 1, Adres: 'Eikenlaan 1', Lat: '52.368237', Long: '4.866694', Selected: false, IsFixed: true }
        ]);
                
        return $.getResolvedPromise(secties);
    };

    return self;
})();

var viewModelDefaults = {
    secties: new kendo.data.DataSource({ data: [] }),
    onSwitchChange: null
};

var controller = (function (dataService, viewModelDefaults)
{
    "use strict";
    var _dataService = dataService;
    var _vm = null;
    // Create "ViewModel".
    var _viewModelDefaults = viewModelDefaults;
    

    var self = {};
    self.addDragAndDropToGrid = function ()
    {
        var gridId = "#sectiesGrid";
        var rowClass = ".sectieRow";
        kendo.addDragAndDropToGrid(gridId, rowClass, _vm);
    };

    self.onSwitchChange = function (event)
    {
        var sectie = event.data;
        var secties = _vm.get("secties").data();
        var index = kendo.getIndexByKey(secties, "Id", sectie.get("Id"));
        var previous = secties[index - 1];
        var next = secties[index + 1];  
    };

    self.handleRouteOnderdeelSectiesRefresh = function (data)
    {
        _vm.set("secties", new kendo.data.DataSource({ data: data }));
    };
            
    self.show = function ()
    {
        self.createViewModel();
        $.when(_dataService.getRouteOnderdeelSecties(1))
        .then(self.handleRouteOnderdeelSectiesRefresh)
        .then(self.bindViewModel);
    };

    self.bindViewModel = function ()
    {
        
        kendo.bind($(".info"), _vm);
        self.addDragAndDropToGrid();
    };

    self.createViewModel = function ()
    {
        _viewModelDefaults.onSwitchChange = self.onSwitchChange;
        _vm = kendo.observable(_viewModelDefaults);
    };

    return self;
})(dataService, viewModelDefaults);

controller.show();