
namespace Research.Core.CodeGeneration
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    
    public interface IFileSystem
    {
        Task CreateDirectoryAsync(string path);
        Task GenerateFileAsync(FileInfoDto file);
        Task GenerateFilesAsync(List<FileInfoDto> files);
        Task MakeFileWritable(string path);
        Task WriteAllText(string path, string content);
    }

    public class FileSystem : IFileSystem
    {
        public Task CreateDirectoryAsync(string path)
        {
            return Task.Factory.StartNew(() => Directory.CreateDirectory(path));
        }

        public async Task GenerateFileAsync(FileInfoDto file)
        {

            string folder = Path.GetDirectoryName(file.Path);
            await CreateDirectoryAsync(folder);
            await MakeFileWritable(file.Path);
            await WriteAllText(file.Path, file.Content);
        }

        public async Task GenerateFilesAsync(List<FileInfoDto> files)
        {
            foreach (FileInfoDto file in files)
            {
                await GenerateFileAsync(file);
            }
        }

        public Task MakeFileWritable(string path)
        {
            return Task.Factory.StartNew(() => { if (File.Exists(path)) { File.SetAttributes(path, FileAttributes.Normal); } });
        }

        public Task WriteAllText(string path, string content)
        {
            return Task.Factory.StartNew(() => { File.WriteAllText(path, content); });
        }
    }

    public class FileInfoDto
    {
        public string Path { get; set; }
        public string Content { get; set; }
    }
}
