using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Research.Core.CodeGeneration
{
    public interface IFileGenerator
    {
       //Task<int> Generate(FileInfoDto file);
       //Task<int> Generate(List<FileInfoDto> files);
    }

    public class FileGenerator : IFileGenerator
    {

        //public async Task Generate(FileInfoDto file)
        //{
        //    var di = new DirectoryInfo("");
        //    di.crea
        //    throw new NotImplementedException();
        //}

        //public async Task Generate(List<FileInfoDto> files)
        //{
        //    foreach (FileInfoDto file in files)
        //    {
        //        Task task = await Generate(file);
        //    }
        //}
    }

    public class FileInfoDto
    {
        public string Path { get; set; }
        public string Content { get; set; }
    }
}
