
namespace Research.EndToEndTests.Extensions
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Research.Core.Extensions;
    using System.Reflection;
    using System.Threading.Tasks;

    [TestClass]
    public class AssemblyExtensionsTester
    {
        [TestMethod]
        public void GetFileAsStringAsync_should_return_correct_file_contents()
        {
            Task<string> task = Assembly.GetExecutingAssembly().GetFileAsStringAsync("Research.EndToEndTests.Extensions.AssemblyExtensionsTester_EmbeddedResource.txt");
            task.Wait();

            string expected = "Hello from resource file.";
            string actual = task.Result;

            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void GetFileAsString_should_return_correct_file_contents()
        {
            string expected = "Hello from resource file.";
            string actual = Assembly.GetExecutingAssembly().GetFileAsString("Research.EndToEndTests.Extensions.AssemblyExtensionsTester_EmbeddedResource.txt");
            
            Assert.AreEqual(expected, actual);
        }
    }
}
