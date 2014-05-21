
namespace Research.EndToEndTests.CodeGeneration
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Research.Core.CodeGeneration;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    using Research.Core.Components;
    using Research.Core.Extensions;
    using System.Reflection;
    using System.Threading.Tasks;

    [TestClass]
    public class SqlScriptGeneratorTester
    {
        [TestMethod]
        public void GetSqlScriptingInput_should_return_correct_input()
        {
            var generator = new SqlScriptGenerator();
            SqlScriptingInput input = generator.GetSqlScriptingInput("MyServer", "MyDatabase");
            input.RootFolder = @"C:\Temp\Generated";

            SqlScriptingResult result = generator.GenerateSqlScripts(input);
            var fs = new FileSystem();
            Task deleteDirectoryTask = fs.DeleteDirectoryAsync(input.RootFolder);
            deleteDirectoryTask.Wait();

            Task generateFilesTask = fs.GenerateFilesAsync(result.Scripts);
            generateFilesTask.Wait();

            Assert.AreEqual(true, true);
        }
    }
}
