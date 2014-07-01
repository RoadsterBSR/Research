
var kendo = kendo || {};

$.getResolvedPromise = function (data)
{
    "use strict";
    /// <summary>
    /// Stub for ajax call.
    /// </summary>
    /// <returns>A manual created promise.</returns>
    data = data || [];
    var dfd = new $.Deferred();
    dfd.resolve(data);
    return dfd.promise();
};

kendo.data.binders.cssToggle = kendo.data.Binder.extend({
    init: function (element, bindings, options)
    {
        kendo.data.Binder.fn.
                    init.call(
                        this, element, bindings, options
                    );

        var target = $(element);
        this.enabledCss = target.data("enabledCss");
        this.disabledCss = target.data("disabledCss");
    },
    refresh: function ()
    {
        if (this.bindings.cssToggle.get())
        {
            $(this.element).addClass(this.enabledCss);
            $(this.element).removeClass(this.disabledCss);
        } else
        {
            $(this.element).addClass(this.disabledCss);
            $(this.element).removeClass(this.enabledCss);
        }
    }
});

var dataService = (function (kendo)
{
    "use strict";
    var _kendo = kendo;
    var self = {};
            
    self.getRouteOnderdeelSecties = function (routeOnderdeelId)
    {
        if (!routeOnderdeelId) { throw "Parameter [routeOnderdeelId] is not set."; }

        var secties = new _kendo.data.ObservableArray(
        [
            { Id: 1, Postcode6GroepSectieId: 1, Adres: 'Kerkweg 22', Lat: '52.367443', Long: '4.865275', Selected: false },
            { Id: 2, Postcode6GroepSectieId: 1, Adres: 'Peilstraat 3', Lat: '52.367967', Long: '4.866217', Selected: false },
            { Id: 3, Postcode6GroepSectieId: 1, Adres: 'Bakkerloop 35', Lat: '52.367946', Long: '4.865482', Selected: false },
            { Id: 4, Postcode6GroepSectieId: 1, Adres: 'Eikenlaan 1', Lat: '52.368237', Long: '4.866694', Selected: false }
        ]);
                
        return $.getResolvedPromise(secties);
    };

    return self;
})(kendo);

var viewModelDefaults = {
    secties: new kendo.data.DataSource({ data: [] })
};

var controller = (function (dataService, viewModelDefaults, kendo)
{
    "use strict";

    var _dataService = dataService;
    var _kendo = kendo;
    var _viewModelDefaults = viewModelDefaults;
    var _vm = kendo.observable(_viewModelDefaults);

    var self = {};
            
    self.handleRouteOnderdeelSectiesRefresh = function (data)
    {
        _vm.set("secties", data);
        _kendo.bind($(".info"), _vm);
    };
            
    self.show = function ()
    {
        $.when(_dataService.getRouteOnderdeelSecties(1))
        .then(self.handleRouteOnderdeelSectiesRefresh);
    };

    return self;
})(dataService, viewModelDefaults, kendo);

controller.show();