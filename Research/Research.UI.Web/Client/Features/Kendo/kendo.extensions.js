var kendo = kendo || {};

kendo.addDragAndDropToGrid = function (gridId, rowClass, viewModel, validateDropTargetFunc)
{
    if (!gridId) { throw "Parameter [gridId] is not set."; }
    if (!rowClass) { throw "Parameter [rowClass] is not set."; }

    $(rowClass).kendoDraggable({
        hint: function (element)
        {
            return element.clone();
        }
    });

    $(gridId).kendoDropTargetArea({
        filter: rowClass,
        drop: function (e)
        {
            var srcUid = e.draggable.element.data("uid");
            var dstUid = e.dropTarget.data("uid");
            var ds = viewModel.get('secties');   // TODO replace by search in HTML.
            var srcItem = ds.getByUid(srcUid);
            var dstItem = ds.getByUid(dstUid);
            var dstIdx = ds.indexOf(dstItem);
            ds.remove(srcItem);
            ds.insert(dstIdx, srcItem);
            e.draggable.destroy();
            kendo.addDragAndDropToGrid(gridId, rowClass, viewModel, validateDropTargetFunc);
        }
    });
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

kendo.getIndexByKey = function (observableArray, key, value)
{
    if (!observableArray) { throw "Parameter [observableArray] is required!"; }
    if (!key) { throw "Parameter [key] is required!"; }
    if (!value) { throw "Parameter [value] is required!"; }

    var result = null;
    for (var i = 0, len = observableArray.length; i < len; i+=1)
    {
        var item = observableArray[i];
        if (item && (key in item))
        {
            var itemValue = item.get(key);
            if (itemValue)
            {
                if (value === itemValue)
                {
                    result = i;
                }
            }
        }
    }
    return result;
};