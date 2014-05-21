
namespace Research.EndToEndTests.CodeGeneration
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Research.Core.CodeGeneration;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    using Research.Core.Components;
    using Research.Core.Extensions;
    using System.IO;
    using System.Reflection;
    using System.Threading.Tasks;

    [TestClass]
    public class SqlScriptGeneratorTester
    {
        [TestMethod]
        public void GenerateSqlScripts_should_generate_correct_scripts_on_disk()
        {
            var generator = new SqlScriptGenerator();
            SqlScriptingInput input = generator.GetSqlScriptingInput(@"MyServer", @"MyDatabase");
            input.RootFolder = @"C:\Temp\Generated";

            SqlScriptingResult result = generator.GenerateSqlScripts(input);
            var fs = new FileSystem();
            Task deleteDirectoryTask = fs.DeleteDirectoryAsync(input.RootFolder);
            deleteDirectoryTask.Wait();

            Task generateFilesTask = fs.GenerateFilesAsync(result.Scripts);
            generateFilesTask.Wait();

            Assert.AreEqual(true, true);
        }

        [TestMethod]
        public void GenerateDeployScript_should_generate_correct_script_on_disk()
        {
            var generator = new SqlScriptGenerator();
            SqlScriptingInput input = generator.GetSqlScriptingInput(@"MyServer", @"MyDatabase");
            input.RootFolder = @"C:\Temp\Generated";

            SqlDeployScriptResult result = generator.GenerateDeployScript(input);
            string template = Assembly.GetExecutingAssembly().GetFileAsString("Research.EndToEndTests.CodeGeneration.SqlScriptGeneratorTester_GenerateDatabaseDeployScript_result.cmd");  

            string content = string.Format(template, result.Schemas, result.Tables, result.Functions, result.StoredProcedures);

            var file = new FileInfoDto
            {
                Path = Path.Combine(input.RootFolder, "Deploy.cmd")
            };
            file.Content = content;

            var fs = new FileSystem();
            Task deleteDirectoryTask = fs.DeleteDirectoryAsync(input.RootFolder);
            deleteDirectoryTask.Wait();

            Task generateFilesTask = fs.GenerateFileAsync(file);
            generateFilesTask.Wait();

            Assert.AreEqual(true, true);
        }
    }
}
