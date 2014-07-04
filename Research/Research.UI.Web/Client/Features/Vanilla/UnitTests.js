
var vanilla = vanilla || {};

describe("isNullOrUndefined", function ()
{

    it('It should fail on undefined, with correct message.', function () {
        expect(function () {
            vanilla.isNullOrUndefined();
        }).toThrowError("Variable [arg1] is null or undefined.");
    });

    it('It should fail on null, with correct message.', function () {
        expect(function () {
            var test = null;
            vanilla.isNullOrUndefined(test);
        }).toThrowError("Variable [arg1] is null or undefined.");
    });
});