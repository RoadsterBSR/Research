using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Research.Core.Components;
using Research.Core.CodeGeneration;
using System.Threading.Tasks;

namespace Research.EndToEndTests.Components
{
    [TestClass]
    public class FileSystemTester
    {
        [TestMethod]
        public void FindAndReplace_should_replace_common_assemblyinfo()
        {
            var solution = new VsSolution();
            var fs = new FileSystem();
            Task task = fs.FindAndReplace(@"C:\Projects\Github\roelvanlisdonk\Research\Main", "AssemblyInfo.cs", System.IO.SearchOption.AllDirectories, solution.RemoveCommonAssemblyInfo);
            task.Wait();
        }
    }
}
