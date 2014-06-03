
namespace Research.EndToEndTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Research.UI.Web.Server.Model;
    using Research.UI.Web.Validation.EntityValidators;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Text.RegularExpressions;    

    [TestClass]
    public class ResearchTester
    {
        //[TestMethod]
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
            

            // Only fail, when exception occurs.
            Assert.IsTrue(true);
        }
    }
}
