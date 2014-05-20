
namespace Research.EndToEndTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Research.Core.CodeGeneration;
    using Research.Core.CodeGeneration.SqlScriptDtos;
    using Research.Core.Extensions;
    using System.Reflection;
    
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
            SqlScriptingInput input = generator.GetSqlScriptingInput(@"dsql02.ada-dev.nl\v2012", "CRIS", "sa", "00sterH0ut");
            // SqlScriptingInput input = generator.GetSqlScriptingInput(@"LI001", "RouteMaker", "", "");

            SqlScriptingResult result = generator.GenerateSqlScripts(input);

            Assert.AreEqual(true, true);
        }
    }
}
