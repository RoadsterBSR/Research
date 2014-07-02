var app = (function ()
{
    var self = {};

    var assert = {};
    assert.areEqual = function (expected, actual)
    {
        if (expected !== actual)
        {
            var expectedFormated = expected;
            if (!expectedFormated)
            {
                expectedFormated = "";
            }

            var actualFormated = actual;
            if (!actualFormated)
            {
                actualFormated = "";
            }

            throw "Expected [" + expectedFormated.toString() + "] is not equals to [" + actualFormated.toString() + "].";
        }
    };


    self.execute = function ()
    {
        self.test_indexOf();
    };

    self.test_indexOf = function ()
    {
        var records = [{ Id: 1 }, { Id: 2 }, { Id: 3 }];

        var record = records[1];
        var index = records.indexOf(record);

        assert.areEqual(1, index);
    };

    return self;
})();
app.execute();