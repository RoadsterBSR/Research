
var kendo = kendo || {};

kendo.controller = (function () {
    var self = {};
    var _vm = null;

    self.show = function () {

        _vm = new kendo.data.ObservableObject({
            products: new kendo.data.DataSource({
                data: new kendo.data.ObservableArray([
                    
                ])
            }),
            productsIsEmpty: function () {
                return this.get("products").data().length === 0;
            }
        });

        kendo.bind($("#view"), _vm);
    };

    return self;
})();

kendo.controller.show();