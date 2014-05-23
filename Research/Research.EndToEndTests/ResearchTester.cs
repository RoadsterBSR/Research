
namespace Research.EndToEndTests
{
    using System;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Collections.Generic;
    using System.Reflection;
    using System.Threading.Tasks;
    using System.IO;
    using System.Data.Entity;
    using Research.UI.Web.Server.Model;
    using Newtonsoft.Json;

    [TestClass]
    public class ResearchTester
    {
        [TestMethod]
        public void TestWithoutTiming()
        {
            var dbContext = new ResearchDbContext();
            string customMetaData = GetCustomMetaData(dbContext);

            // Only fail, when exception occurs.
            Assert.IsTrue(true);
        }

        private string GetCustomMetaData(DbContext dbContext)
        {
            string result = string.Empty;
            Type type = dbContext.GetType();
            
            List<PropertyInfo> propertyInfos = type.GetProperties().Where(p => p.PropertyType.Name.Equals("DbSet`1")).ToList();

            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                Type entityType = propertyInfo.PropertyType.GenericTypeArguments[0];
                IEnumerable<Attribute> entityAttributes = entityType.GetCustomAttributes();
                foreach(Attribute entityAttribute in entityAttributes)
                {
                    string serializedEntityAttribute = JsonConvert.SerializeObject(entityAttribute);
                }

                PropertyInfo[] epis = entityType.GetProperties();
                foreach (PropertyInfo epi in epis)
                {
                    IEnumerable<Attribute> epiAttributes = epi.PropertyType.GetCustomAttributes();
                    foreach (Attribute epiAttribute in epiAttributes)
                    {
                        string serializedEntityAttribute = JsonConvert.SerializeObject(epiAttribute);
                        string stop = "";
                    }
                }
            }
            
            return result;
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

            // Only fail, when exception occurs.
            Assert.IsTrue(true);
        }
    }
}
