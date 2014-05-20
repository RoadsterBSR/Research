
namespace Research.Core.Extensions
{
    using System.IO;
    using System.Reflection;
    using System.Threading.Tasks;

    public static class AssemblyExtensions
    {
        /// <summary>
        /// Get the contents of the given resource as a string (async).
        /// </summary>
        /// <param name="assembly"></param>
        /// <param name="resourceName">The fullname of the resource (eg. MyNamspace.Folder.ResourceName).</param>
        /// <returns></returns>
        public static async Task<string> GetFileAsStringAsync(this Assembly assembly, string resourceName)
        {
            string result = string.Empty;

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    result = await reader.ReadToEndAsync();
                }    
            }
                        
            return result;
        }

        /// <summary>
        /// Get the contents of the given resource as a string.
        /// </summary>
        /// <param name="assembly"></param>
        /// <param name="resourceName">The fullname of the resource (eg. MyNamspace.Folder.ResourceName).</param>
        /// <returns></returns>
        public static string GetFileAsString(this Assembly assembly, string resourceName)
        {
            string result = string.Empty;

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    result = reader.ReadToEnd();
                }
            }

            return result;
        }
    }
}
