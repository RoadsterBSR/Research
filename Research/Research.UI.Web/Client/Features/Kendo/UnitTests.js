
var kendo = kendo || {};

describe("kendo.getIndexByKey", function ()
{
    var records = new kendo.data.ObservableArray([
        { Id: 4,  Name: "John Doe" },
        { Id: 5, Name: "Jane Doe" },
        { Id: 6, Name: "Dene Kaar" },
        { Id: 7, Name: "Fol Beam" }
    ]);

    it("should get correct index", function ()
    {
        expect(kendo.getIndexByKey(records, "Id", 6)).toEqual(2);
    });
});