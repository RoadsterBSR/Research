
namespace Research.Console
{
    using Research.Core.CodeGeneration;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    using Research.Core.Components;
    using System.Configuration;
    using System.Threading.Tasks;

    public class Program
    {

        public static void Main(string[] args)
        {
            var generator = new SqlScriptGenerator();
            
            string server = ConfigurationManager.AppSettings["Server"];
            string database = ConfigurationManager.AppSettings["Database"];
            string generatedScriptsPath = ConfigurationManager.AppSettings["GeneratedScriptsPath"];

            SqlScriptingInput input = generator.GetSqlScriptingInput(server, database);
            input.RootFolder = generatedScriptsPath;

            SqlScriptingResult result = generator.GenerateSqlScripts(input);
            var fs = new FileSystem();
            Task deleteDirectoryTask = fs.DeleteDirectoryAsync(input.RootFolder);
            deleteDirectoryTask.Wait();

            Task generateFilesTask = fs.GenerateFilesAsync(result.Scripts);
            generateFilesTask.Wait();
        }
    }
}
