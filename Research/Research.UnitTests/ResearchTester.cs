
namespace Research.UnitTests
{
    using System;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Reflection;
    using System.Threading.Tasks;
    using System.IO;

    [TestClass]
    public class ResearchTester
    {
        [TestMethod]
        public void TestWithoutTiming()
        {
            Func<string, Task<string>> func = new Func<string, Task<string>>(ReadAllTextAsync);
            Task<string> task = func(@"C:\Temp\temp.txt");
            task.Wait();
            string result = task.Result;
        }

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
        }

        public async Task<string> ReadAllTextAsync(string path)
        {
            string result = await Task.Factory.StartNew(() => { return File.ReadAllText(path); });
            return result;
        }
    }
}
