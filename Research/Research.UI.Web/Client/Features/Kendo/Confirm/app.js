
var kendo = kendo || {};

kendo.controller = (function () {
    var self = {};
    var _vm = null;
    var _confirm = null;
    var _confirmTemplate = null;

    self.show = function () {
        _confirm =  $("#confirm").kendoWindow({
            title: "Delete record",
            visible: false, // The window will not appear before its .open method is called.
        }).data("kendoWindow");
        _confirmTemplate = kendo.template($("#confirmTemplate").html());
        _vm = new kendo.data.ObservableObject({
            onShowClick: function () {
                // Dynamically set some window options.
                _confirm.setOptions({
                    position: {
                        top: 200,
                        left: 200
                    }
                });
                _confirm.content(_confirmTemplate({ ConfirmText: "Delete record?"}));
                _confirm.open();

                $("#yesButton").click(function () {

                    // TODO: Delete record.
                    _confirm.close();
                })
                $("#noButton").click(function () {
                    // User cancelled the window.
                    _confirm.close();
                })
            }
        });

        kendo.bind($(".page"), _vm);
    };

    return self;
})();

kendo.controller.show();