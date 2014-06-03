
namespace Research.Core.CodeGeneration
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;

    public class VsSolution
    {
        /// <summary>
        /// This function will remove common information found in all AssemblyInfo.cs files and add this to a CommonAssemblyInfo.cs file.
        /// This CommonAssemblyInfo.cs file is then linked to each project.
        /// Extracting common information is done to manage this information in one place.
        /// 
        /// For instance: Managing one version number for all assemblies in the solution.
        /// </summary>
        public void AddCommonAssemblyInfo()
        {
            // GetFiles
            // GetFileContents
            // Remove information
        }

        /// <summary>
        /// Remove common assembly info from the given content.
        /// Like:
        /// - AssemblyCompany
        /// - AssemblyCopyright
        /// - AssemblyVersion
        /// - AssemblyFileVersion
        /// </summary>
        public string RemoveCommonAssemblyInfo(string content)
        {
            string result = string.Empty;

            if (!string.IsNullOrWhiteSpace(content))
            {
                result = content;
                var regexes = new List<Regex>();
                regexes.Add(new Regex(@"\r\n\[assembly: AssemblyCompany\(""{1}.*""{1}\)]"));
                regexes.Add(new Regex(@"\r\n\[assembly: AssemblyCopyright\(""{1}.*""{1}\)]"));
                regexes.Add(new Regex(@"\r\n\[assembly: AssemblyVersion\(""{1}.*""{1}\)]"));
                regexes.Add(new Regex(@"\r\n\[assembly: AssemblyFileVersion\(""{1}.*""{1}\)]"));
                regexes.Add(new Regex(@"\r\n\r\n// Version information.*""{1}\)]", RegexOptions.Singleline));

                regexes.ForEach(x =>
                {
                    result = x.Replace(result, string.Empty);
                });
            }

            return result;
        }
    }
}
