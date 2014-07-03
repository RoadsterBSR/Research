// This is the function we will test.
function addOne(num)
{
    if (typeof num === "number")
    {
        return num + 1;
    }
    else
    {
        return "not a number";
    }
}

// These are the tests.
describe("addOne", function ()
{
    it("should be a function", function ()
    {
        expect(typeof addOne).toEqual('function');
    });

    it("should be add one to an integer argument", function ()
    {
        expect(addOne(1)).toEqual(2);
    });

    describe("when argument is not a number", function ()
    {
        it("should return 'not a number' when argument is String", function ()
        {
            expect(addOne("this is a string")).toEqual("not a number");
        });
    });
});