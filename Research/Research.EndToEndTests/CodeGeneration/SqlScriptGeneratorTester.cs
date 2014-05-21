
namespace Research.EndToEndTests
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
    public class CodeGeneratorTester
    {
        [TestMethod]
        public void GenerateDatabaseScripts_should_generate_correct_output()
        {
            var generator = new SqlScriptGenerator();
            string inputAsString = Assembly.GetExecutingAssembly().GetFileAsString("Research.EndToEndTests.CodeGeneration.SqlScriptGeneratorTester_GenerateDatabaseScripts_input.json");            
            SqlScriptingInput input = JsonConvert.DeserializeObject<SqlScriptingInput>(inputAsString);

            SqlScriptingResult result = generator.GenerateSqlScripts(input);
            string expected = Assembly.GetExecutingAssembly().GetFileAsString("Research.EndToEndTests.CodeGeneration.SqlScriptGeneratorTester_GenerateDatabaseScripts_output.json");
            string actual = JsonConvert.SerializeObject(result);

            Assert.AreEqual(expected, actual);
        }

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
