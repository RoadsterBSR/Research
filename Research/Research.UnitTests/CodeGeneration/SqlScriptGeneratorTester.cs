
namespace Research.UnitTests.CodeGeneration
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;


    /// <summary>
    /// Summary description for SqlScriptGeneratorTester
    /// </summary>
    [TestClass]
    public class SqlScriptGeneratorTester
    {
        public SqlScriptGeneratorTester()
        {
        }


        public string GetDefaultText(string dataTypeName, string defaultText)
        {
            if (string.IsNullOrWhiteSpace(dataTypeName)) { throw new ArgumentException("Parameter can't be null, empty or contain only whitespaces", "dataTypeName"); }

            string result = defaultText;
            if (dataTypeName.Equals("smalldatetime", System.StringComparison.InvariantCultureIgnoreCase) ||
                dataTypeName.Equals("datetime", System.StringComparison.InvariantCultureIgnoreCase))
            {
                result = "getdate()";
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dataTypeName)) {
                    throw new ArgumentException("Parameter can't be null, empty or contain only whitespaces, when dataTypeName is not (smalldatetime or datetime).", "defaultText");
                }
            }
        
            return result;
        }

        [TestMethod]
        public void GetDefaultText_test()
        {
            string actual = GetDefaultText("smalldatetime", null);
            Assert.AreEqual("getdate()", actual);
            actual = GetDefaultText("datetime", null);
            Assert.AreEqual("getdate()", actual);
            actual = GetDefaultText("int", "0");
            Assert.AreEqual("0", actual);
        }
    }
}
