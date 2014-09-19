
namespace Research.EndToEndTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class TemplateTester
    {
        [TestMethod]
        public void TestWithTiming()
        {
            var watch = new System.Diagnostics.Stopwatch();
            watch.Start();

            for (int i = 0; i < 1000000; i++)
            {
                // Call function:
            }

            watch.Stop();
            System.Console.WriteLine(watch.Elapsed.TotalMilliseconds);

            // Only fail, when exception occurs.
            Assert.IsTrue(true);
        }

        [TestMethod]
        public void TestWithoutTiming()
        {
            // ... Call code to test here ... //
            Assert.IsTrue(true);
        }
    }
}
