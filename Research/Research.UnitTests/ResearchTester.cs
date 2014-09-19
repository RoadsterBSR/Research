
namespace Research.UnitTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class ResearchTester
    {

        [TestMethod]
        public void Test()
        {


        }

        [TestMethod]
        public void ShouldTrimLineTest()
        {
            string line = "1st;2nd;;;;;;;;;;;";
            string trimmendLine = line.TrimEnd(';');
            Assert.AreEqual("1st;2nd", trimmendLine);

            line = "1st;2nd";
            trimmendLine = line.TrimEnd(';');
            Assert.AreEqual("1st;2nd", trimmendLine);

            string delimeter = ";";
            line = "1st;2nd;;;;;;;;;;;";
            line = line.TrimEnd(delimeter.ToCharArray());
            Assert.AreEqual("1st;2nd", line);

        }
    }
}
