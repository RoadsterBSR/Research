
namespace Research.EndToEndTests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Research.Core.Components;
    using Research.UI.Web.Server.Model;
    using Research.UI.Web.Validation.EntityValidators;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;    

    [TestClass]
    public class ResearchTester
    {
        [TestMethod]
        public void TestWithTiming()
        {
            var watch = new System.Diagnostics.Stopwatch();
            watch.Start();

            int times = 1;
            for (int i = 0; i < times; i++)
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
            GenerateSprocs();

            // Only fail, when exception occurs.
            Assert.IsTrue(true);
        }

        public void GenerateSprocs()
        {
            string tepmlate = @"
if object_id('dbo.{0}') is not null
begin
	drop procedure dbo.{0}
end
go

create procedure dbo.{0}
	@ProductieOrder bigint
as
begin
	set nocount on

	
end
go

";

            string[] names = {
"Afkeur7060",
"AfkeurRegulier",
"AfkeurVisual",
"DataTracibilityImport",
"FeatureImport",
"FeaturePropertiesImport",
"FeatureRunDataImport",
"PartImport",
"RoutineImport",
"BC3D1",
"BC3D2",
"BC7060",
"BCPMA",
"BCVisual",
"EC3D1",
"EC3D2",
"EC7060",
"ECPMA",
"ECQV",
"ECVisual",
"Meetgegevens",
"Meetgegevens7060",
"MeetgegevensVisual",
"BCQV"
                             };

            var fs = new FileSystem();
            string exportFolder = @"C:\Temp\";
            foreach (string name in names)
            {
                var file = new FileInfoDto
                {
                    Path = "dbo." + Path.Combine(exportFolder, name + ".sql")
                };
                file.Content = string.Format(tepmlate, name);
                Task generateFilesTask = fs.GenerateFileAsync(file);
                generateFilesTask.Wait();
            }      
        }
    }
}