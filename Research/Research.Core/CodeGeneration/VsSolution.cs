
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
        /// Add CommonAssemblyInfo as link to a project.
        /// </summary>
        public string AddCommonAssemblyInfo(string content)
        {
            string result = string.Empty;

            if (!string.IsNullOrWhiteSpace(content))
            {
                result = content;

                var findRegEx = new Regex(@"<ItemGroup>.*
<Compile Include=""..\\SharedSource\\CommonAssemblyInfo.cs"">
<Link>CommonAssemblyInfo.cs</Link>
</Compile>.*
</ItemGroup>", RegexOptions.Singleline);

                if (!findRegEx.IsMatch(content))
                {
                    var replaceRegEx = new Regex(@"<ItemGroup>");

                    result = replaceRegEx.Replace(result, @"<ItemGroup>
<Compile Include=""..\\SharedSource\\CommonAssemblyInfo.cs"">
<Link>CommonAssemblyInfo.cs</Link>
</Compile>", 1);
                }


            }

            return result;
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
